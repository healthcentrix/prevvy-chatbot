FROM node:12

# Create app directory
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm tsc
COPY . .
