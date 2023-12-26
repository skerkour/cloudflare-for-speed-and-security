VERSION := 0.1.0
DIST_DIR = dist
CMD = origin

DOCKER_IMAGE = ghcr.io/skerkour/cloudflare-book-origin

####################################################################################################
# Dev
####################################################################################################
.PHONY: dev
dev:
	watchgod -log-prefix=false -build="make build_dev" -command="./dist/$(CMD)" -pattern ".+\\.go" -graceful-kill=true

.PHONY: build_dev
build_dev:
	go build -o $(DIST_DIR)/$(CMD) ./main.go

.PHONY: tidy
tidy:
	go mod tidy

.PHONY: fmt
fmt:
	go fmt ./...

.PHONY: test
test:
	CGO_ENABLED=0 go test ./...

.PHONY: clean
clean:
	rm -rf $(DIST_DIR)

.PHONY: update_deps
update_deps:
	go get -u ./cmd/...
	go mod tidy
	go mod tidy

.PHONY: delete_ds_store
delete_ds_store:
	find . -type f -name .DS_Store -exec rm {} \;

####################################################################################################
# CI/CD
####################################################################################################
.PHONY: docker_build
docker_build:
	docker build -t $(DOCKER_IMAGE):latest . -f Dockerfile --pull --no-cache

.PHONY: docker_push
docker_push:
	docker push $(DOCKER_IMAGE):latest

.PHONY: verify_deps
verify_deps:
	go mod verify

.PHONY: download_deps
download_deps:
	go mod download

####################################################################################################
# origin
####################################################################################################
BUILD_ORIGIN = go build -o $(DIST_DIR)/$(CMD) -a -ldflags "-extldflags -static -w -s" ./main.go

.PHONY: origin
origin:
	mkdir -p $(DIST_DIR)
	GOOS=linux CGO_ENABLED=0 $(BUILD_ORIGIN)
