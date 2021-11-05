# Use the official lightweight Node.js 16 image.
# https://hub.docker.com/_/node
FROM node:16-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# Assign ENV variables
# Type of Node Environment
ENV PROJECT_NAME="Blockchain Seminar App"
ENV NODE_ENV="dev"
ENV NODE_PORT=8899

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY . ./

# Expose the Port Outside the container to the localhost
EXPOSE 8899

# Run the web service on container startup.
CMD [ "npm", "start" ]