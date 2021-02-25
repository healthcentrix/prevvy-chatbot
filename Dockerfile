FROM gcr.io/google.com/cloudsdktool/cloud-sdk:alpine

RUN apk add --update nodejs npm

# Create app directory
WORKDIR /usr/src/app
ADD . /usr/src/app
ADD run.sh /usr/src/app/run.sh
RUN npm install typescript -g
RUN npm install
RUN npm run build
COPY . .
#CMD [ "npm", "run" , "start" ]
CMD [ "/usr/src/app/run.sh" ]
EXPOSE 8080
