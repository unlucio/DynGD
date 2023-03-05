FROM node:lts-alpine
LABEL maintainer="unlucio@gmail.com"

COPY . /app
WORKDIR /app

RUN npm install --ignore-scripts --progress=false

CMD ["/usr/local/bin/npm", "start"]
