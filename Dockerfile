FROM node:18.13
LABEL maintainer="unlucio@gmail.com"

COPY . /app
WORKDIR /app

RUN npm install --ignore-scripts --progress=false

EXPOSE $PORT

CMD ["/usr/local/bin/npm", "start"]
