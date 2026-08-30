FROM alpine:3.18

# Install required compilers and runtimes
RUN apk update && apk add --no-cache \
    g++ \
    gcc \
    openjdk17-jdk \
    python3 \
    nodejs \
    bash

WORKDIR /app
