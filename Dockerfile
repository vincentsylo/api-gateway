FROM node:carbon

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run build

EXPOSE $API_PORT

CMD ["npm", "run", "serve"]
