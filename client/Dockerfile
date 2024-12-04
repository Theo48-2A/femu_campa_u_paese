FROM node:22 AS dev  
WORKDIR /app


COPY package.json package-lock.json ./
RUN npm install


COPY . .


EXPOSE 3000


CMD ["npm", "start"]

