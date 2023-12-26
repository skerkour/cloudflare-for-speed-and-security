####################################################################################################
## Build origin
####################################################################################################
FROM golang:1.21-alpine AS builder_go

# Install git + SSL ca certificates.
# Git is required for fetching the dependencies.
# Ca-certificates is required to call HTTPS endpoints.
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache ca-certificates git make
RUN update-ca-certificates

WORKDIR /origin
COPY . ./

RUN make clean

RUN make download_deps
RUN make verify_deps

RUN make origin

####################################################################################################
## To get the correct files in the final image
####################################################################################################
FROM alpine:latest AS builder_files

ENV TZ="Europe/London"
ENV LC_ALL="en_US.UTF-8"
ENV LANG="en_US.UTF-8"
ENV LANGUAGE="en_US:en"

ENV USER=origin
ENV UID=10001

# mailcap is used for content type (MIME type) detection
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache ca-certificates mailcap tzdata

RUN update-ca-certificates
RUN echo "${TZ}" > /etc/timezone

RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    "${USER}"


####################################################################################################
## Final image
####################################################################################################
FROM scratch

ENV TZ="Europe/London"
ENV LC_ALL="en_US.UTF-8"
ENV LANG="en_US.UTF-8"
ENV LANGUAGE="en_US:en"

# Copy files and build
COPY --from=builder_files /etc/passwd /etc/passwd
COPY --from=builder_files /etc/group /etc/group
COPY --from=builder_files /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=builder_files /etc/mime.types /etc/mime.types
COPY --from=builder_files /etc/timezone /etc/timezone

COPY --from=builder_go /origin/dist/origin /usr/local/bin/origin

# Use an unprivileged user.
USER origin:origin

WORKDIR /origin

CMD ["origin"]

EXPOSE 8080 8443
