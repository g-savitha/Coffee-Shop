FROM node:18 as build

WORKDIR /app

COPY package*.json ./
COPY packages/frontend/package*.json packages/frontend/

RUN npm install

COPY . .

WORKDIR /app/packages/frontend

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]