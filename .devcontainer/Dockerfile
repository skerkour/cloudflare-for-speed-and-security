FROM alpine:3.18

ENV TZ="Europe/London"
ENV LC_ALL="en_US.UTF-8"
ENV LANG="en_US.UTF-8"
ENV LANGUAGE="en_US:en"

# appuser
ENV USER=dev
ENV UID=10001

RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache mailcap tzdata git make vim postgresql15-client bash gcc g++ curl wget zip coreutils \
        libstdc++ openssh-client-default && \
    update-ca-certificates && \
    echo "${TZ}" > /etc/timezone

ENV USER=dev
ENV UID=10001

RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/home/${USER}" \
    --shell "/bin/bash" \
    # --no-create-home \
    --uid "${UID}" \
    "${USER}"

RUN apk add --no-cache nodejs npm
RUN npm config set ignore-scripts true

USER $USER

COPY bashrc /home/$USER/.bashrc
COPY vimrc /home/$USER/.vimrc

RUN mkdir -p /home/$USER/.local/bin \
    /home/$USER/.local/gopath
# ENV GOROOT /home/$USER/.local/go
ENV GOPATH /home/$USER/.local/gopath
ENV GOPROXY direct

ENV PATH $PATH:/home/$USER/.local/bin:$GOROOT/bin:$GOPATH/bin

WORKDIR /
