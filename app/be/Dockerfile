FROM node:10.16.3-alpine AS base
LABEL maintainer "hualei03042013@163.com"
WORKDIR /app/

#install deps
FROM base AS deps
COPY ./package*.json ./
RUN npm install

#build some code
#FROM deps AS build
#COPY ./ ./
#COPY ./.dockerignore ./
#RUN npm run build

#pro image
#-copy deps lib desc from deps satge and install deps
#-copy some build code from build satge
#copy project source code from pm to cm and install deps
FROM base AS pro
COPY ./.dockerignore ./
COPY ./ ./
RUN npm install --only=production
#COPY --from=build  /app/dist dist

EXPOSE 4000
#CMD ["npm", "run" ,"pm2"]
#CMD ["npm", "run" ,"start"]
CMD ["npm", "run" ,"koa"]
