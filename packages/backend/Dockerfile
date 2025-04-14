FROM node:18

WORKDIR /app

COPY package*.json ./
COPY packages/backend/package*.json packages/backend/

RUN npm install

COPY . .

WORKDIR /app/packages/backend

CMD ["npm", "start"]