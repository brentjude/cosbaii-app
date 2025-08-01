FROM node:18-alpine
RUN adduser -D -s /bin/sh -u 1001 app
USER app

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000
CMD npm run dev