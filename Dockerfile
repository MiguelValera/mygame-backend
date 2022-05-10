FROM node:16 as builder

ENV NODE_ENV dev

WORKDIR /usr/app

COPY . . 

RUN npm i && npm run build

FROM node:16

WORKDIR /usr/app

COPY package*.json ./

ENV NODE_ENV production

ENV HTTP_PORT 3099

RUN npm ci && mkdir /usr/app/resources

COPY --from=builder /usr/app/dist /usr/app/

EXPOSE 3099

CMD ["npm", "start"]