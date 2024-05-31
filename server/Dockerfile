FROM --platform=linux/amd64 node:21.7.3
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8004
CMD ["npm", "start"]