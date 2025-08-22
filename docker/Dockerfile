# Node based image
FROM node:22-alpine

# main application's directory
WORKDIR /app

# copy package*.json ./
COPY . .

# run packages
RUN npm install \
    && npm cache clean --force \
    && rm -rf node_modules

EXPOSE 8081

CMD ["node","server/app.js"]