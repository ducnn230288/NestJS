FROM node:16-alpine as builder

WORKDIR /usr/src/app
COPY . .
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN npm install -g @nestjs/cli
RUN npm install


RUN npm run build


CMD ["npm", "run",  "start:prod"]