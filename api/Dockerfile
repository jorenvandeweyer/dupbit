FROM node:12-stretch

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]
