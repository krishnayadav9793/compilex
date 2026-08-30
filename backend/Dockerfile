FROM node:20-alpine

# Install Docker CLI to execute docker commands from inside this container (sends requests to host daemon via socket)
RUN apk add --no-cache docker-cli

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# We will add "dev" and "start" scripts in package.json
CMD ["npm", "run", "dev"]
