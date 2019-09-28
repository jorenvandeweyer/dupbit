FROM node:12-stretch

WORKDIR /usr/src/app

COPY nodemon.json ./
COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]
