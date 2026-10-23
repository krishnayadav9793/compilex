# ==============================================================================
# CompileX Backend Docker Image for Render / Cloud Deployment
# Runs Express + Socket.IO with all compilers (GCC, G++, Python3, Node, Java)
# ==============================================================================

FROM node:20-alpine

# Set non-interactive environment
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# Install compilers, interpreters, execution utilities
RUN apk update && apk add --no-cache \
    gcc \
    g++ \
    musl-dev \
    python3 \
    openjdk17 \
    bash \
    coreutils \
    findutils \
    grep \
    sed \
    util-linux

# Configure Java environment paths
ENV JAVA_HOME="/usr/lib/jvm/java-17-openjdk"
ENV PATH="${JAVA_HOME}/bin:${PATH}"

WORKDIR /app

# Copy dependency definitions and install production packages
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copy backend source code
COPY backend/ ./

# Expose server port (Render dynamically sets $PORT)
ENV PORT=3000
EXPOSE 3000

# Start server
CMD ["node", "index.js"]
