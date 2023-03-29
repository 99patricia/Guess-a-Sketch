FROM node:18.14.0

WORKDIR /server

COPY package*.json .
RUN npm install
RUN npm install express@4  
RUN npm install socket.io  
RUN npm install socket.io-client
RUN npm fund

COPY . .
CMD node server.js
