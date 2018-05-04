FROM node:carbon

WORKDIR /usr/src/app

RUN apt-get update && \
	apt-get install -y libav-tools 	mkvtoolnix && \
	apt-get clean

RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl

RUN chmod a+rx /usr/local/bin/youtube-dl

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8125
CMD [ "npm", "start" ]
