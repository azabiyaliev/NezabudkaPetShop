# Build Stage
FROM node:20 AS BUILD

WORKDIR /app

COPY package*.json ./\

RUN npm install

RUN npm rebuild bcrypt

COPY . .

RUN npm run build


# Production Stage
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm install

EXPOSE 8000

CMD ["node", "dist/main"]