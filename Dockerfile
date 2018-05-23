FROM node:carbon

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

EXPOSE $API_PORT

CMD ["npm", "run", "serve"]
