FROM node:12

# Create app directory
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN npm install typescript -g
RUN npm install
RUN npm run build
COPY . .
CMD [ "npm", "run" , "start" ]
EXPOSE 8080
