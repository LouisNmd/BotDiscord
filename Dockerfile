FROM node:lts
RUN mkdir -p /src
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
CMD cd /src && npm start
