FROM node:latest

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 5713

CMD ["npm", "run", "dev"]