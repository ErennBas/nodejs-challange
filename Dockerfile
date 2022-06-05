FROM node:14.18.0
WORKDIR /opt/teknasyon-nodejs-challange
COPY app/ .
RUN npm install
CMD ["npm", "run", "start:dev"]