FROM node:10-stretch

WORKDIR /usr/src/app

RUN apt-get update && \
	apt-get install -y build-essential && \
	apt-get clean

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
