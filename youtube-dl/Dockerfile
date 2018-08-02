FROM node:carbon

WORKDIR /usr/src/app

RUN apt-get update && \
	apt-get install -y libav-tools 	mkvtoolnix && \
	apt-get clean

RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl

RUN chmod a+rx /usr/local/bin/youtube-dl

ARG CACHEBUST=3

RUN git clone https://github.com/jorenvandeweyer/youtube-dl-docker-api.git .

RUN npm install

COPY ./config.json ./

EXPOSE 8000

CMD [ "npm", "start" ]
