# Build Stage
FROM node:20 AS build

WORKDIR /app

ARG BUILD_DATE
ENV BUILD_DATE=$BUILD_DATE

COPY package*.json ./

RUN npm install

RUN npm rebuild bcrypt

COPY . .

RUN npm run build


# Production Stage
FROM node:20-alpine AS production

WORKDIR /app

ARG BUILD_DATE
ENV BUILD_DATE=$BUILD_DATE

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

COPY --from=build /app/prisma ./prisma
COPY --from=build /app/.env .env

COPY --from=build /app/public ./public

RUN npm install --omit=dev

EXPOSE 8000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

