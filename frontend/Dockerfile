# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG BUILD_DATE
ENV BUILD_DATE=$BUILD_DATE

COPY package*.json ./

RUN npm install

COPY . .

RUN node --max-old-space-size=2048 ./node_modules/.bin/vite build


# Production Stage
FROM nginx:stable-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
