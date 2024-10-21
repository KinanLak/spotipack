FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80