package main

import (
	"context"
	"crypto/tls"
	"embed"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"sync"
	"syscall"
	"time"

	"github.com/bloom42/stdx/httpx"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"golang.org/x/crypto/acme/autocert"
)

//go:embed public/*
var publicFS embed.FS
var assetsFS fs.FS

const (
	DEFAULT_PORT_HTTP    = "8080"
	PORT_HTTPS           = "8443"
	SERVER_READ_TIMEOUT  = 5 * time.Second
	SERVER_WRITE_TIMEOUT = 10 * time.Second
	SERVER_IDLE_TIMEOUT  = 1 * time.Hour
)

type Config struct {
	portHttp              string
	httpsDomain           string
	httpsLetsEncryptEmail string
}

func init() {
	assetsFS, _ = fs.Sub(publicFS, "public")
}

func main() {
	// for graceful shutdown
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, os.Kill,
		syscall.SIGHUP,
		syscall.SIGINT,
		syscall.SIGTERM,
		syscall.SIGQUIT,
	)
	defer cancel()

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil)).
		With(slog.String("service", "cloudflarebook-origin"))

	config, err := loadConfig()
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}

	logger.Info("config loaded",
		slog.Group("config",
			slog.String("port_http", config.portHttp),
			slog.String("https_domains", config.httpsDomain),
			slog.String("https_lets_encrypt_email", config.httpsLetsEncryptEmail),
		))

	router, err := loadRouter()
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}

	var gracefulShutdownWaitGroup sync.WaitGroup
	var httpServer *http.Server
	var httpsServer *http.Server

	if config.httpsDomain != "" {
		certManager := &autocert.Manager{
			Email:      config.httpsLetsEncryptEmail,
			Prompt:     autocert.AcceptTOS,
			HostPolicy: autocert.HostWhitelist(config.httpsDomain),
			Cache:      autocert.DirCache("/origin/certs"),
		}
		tlsConfig := &tls.Config{
			GetCertificate: certManager.GetCertificate,
			MinVersion:     tls.VersionTLS13,
		}
		httpsServer = &http.Server{
			Addr:         ":" + PORT_HTTPS,
			Handler:      router,
			ReadTimeout:  SERVER_READ_TIMEOUT,
			WriteTimeout: SERVER_WRITE_TIMEOUT,
			IdleTimeout:  SERVER_IDLE_TIMEOUT,
			TLSConfig:    tlsConfig,
		}
		httpServer = &http.Server{
			Addr:         ":" + config.portHttp,
			Handler:      certManager.HTTPHandler(nil),
			ReadTimeout:  5 * time.Second,
			WriteTimeout: 5 * time.Second,
			IdleTimeout:  5 * time.Second,
		}

		go func() {
			<-ctx.Done()
			logger.Info("Shutting down HTTPS server")
			// requests have 5 seonds to finish
			ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
			defer cancel()
			err = httpsServer.Shutdown(ctx)
			if err != nil {
				logger.Error(fmt.Sprintf("error Shutting down HTTPS server: %s", err))
				return
			}
		}()

		gracefulShutdownWaitGroup.Add(1)
		logger.Info("Starting HTTPS server", slog.String("port", PORT_HTTPS))
		err = httpsServer.ListenAndServeTLS("", "")
		gracefulShutdownWaitGroup.Done()
		if errors.Is(err, http.ErrServerClosed) {
			err = nil
		}
		if err != nil {
			logger.Error(fmt.Sprintf("error running HTTPS server: %s", err))
			os.Exit(1)
		}
	} else {
		httpServer = &http.Server{
			Addr:         ":" + config.portHttp,
			Handler:      router,
			ReadTimeout:  SERVER_READ_TIMEOUT,
			WriteTimeout: SERVER_WRITE_TIMEOUT,
			IdleTimeout:  SERVER_IDLE_TIMEOUT,
		}
	}

	go func() {
		<-ctx.Done()
		logger.Info("Shutting down HTTP server")
		// requests have 5 seonds to finish
		ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
		defer cancel()
		err = httpServer.Shutdown(ctx)
		gracefulShutdownWaitGroup.Done()
		if err != nil {
			logger.Error(fmt.Sprintf("error Shutting down HTTP server: %s", err))
			return
		}
	}()

	gracefulShutdownWaitGroup.Add(1)
	logger.Info("Starting HTTP server", slog.String("port", config.portHttp))
	err = httpServer.ListenAndServe()
	if errors.Is(err, http.ErrServerClosed) {
		err = nil
	}
	if err != nil {
		logger.Error(fmt.Sprintf("error running HTTP server: %s", err))
		os.Exit(1)
	}

	gracefulShutdownWaitGroup.Wait()
}

func loadConfig() (config Config, err error) {
	portHttp := os.Getenv("PORT")
	if portHttp == "" {
		portHttp = DEFAULT_PORT_HTTP
	}

	httpsDomain := os.Getenv("HTTPS_DOMAIN")

	httpsLetsEncryptEmail := os.Getenv("HTTPS_LETS_ENCRYPT_EMAIL")

	if httpsDomain != "" && httpsLetsEncryptEmail == "" {
		err = errors.New("HTTPS_LETS_ENCRYPT_EMAIL is missing while HTTPS_DOMAIN is configured")
		return
	} else if httpsLetsEncryptEmail != "" && httpsDomain == "" {
		err = errors.New("HTTPS_DOMAIN is missing while HTTPS_LETS_ENCRYPT_EMAIL is configured")
		return
	}

	config = Config{
		portHttp:              portHttp,
		httpsDomain:           httpsDomain,
		httpsLetsEncryptEmail: httpsLetsEncryptEmail,
	}

	return
}

func loadRouter() (router chi.Router, err error) {
	router = chi.NewRouter()

	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))
	router.Use(middleware.Compress(5, "application/*", "text/*"))
	router.Use(middleware.RedirectSlashes)
	router.Use(middleware.CleanPath)

	router.Get("/", IndexHandler)

	webappHandler, err := httpx.WebappHandler(assetsFS, "404.html", http.StatusNotFound)
	if err != nil {
		return
	}

	router.NotFound(webappHandler)

	return
}

func IndexHandler(w http.ResponseWriter, req *http.Request) {
	file, _ := assetsFS.Open("index.html")
	defer file.Close()

	fileInfo, _ := file.Stat()

	w.Header().Add("Content-Type", "text/html; charset=utf-8")
	w.Header().Add("Content-Length", strconv.Itoa(int(fileInfo.Size())))
	w.Header().Add("Cache-Control", "private, no-cache, no-store, must-revalidate")

	w.WriteHeader(http.StatusOK)
	io.Copy(w, file)
}
