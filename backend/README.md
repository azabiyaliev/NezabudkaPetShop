# Backend – NestJS + Prisma + PostgreSQL

This is the server-side of the application built with [NestJS](https://nestjs.com/), using [Prisma](https://www.prisma.io/) as the ORM and PostgreSQL as the database.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL

### Installation

```bash
npm install
```

### Create a .env file based on .env.template 

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
GOOGLE_CLIENT_ID="*****************"
GOOGLE_CLIENT_SECRET="*****************"
GOOGLE_CALLBACK_URL="*****************"

FACEBOOK_APP_ID="*****************"
FACEBOOK_APP_SECRET="*****************"

EMAIL_USER="*****************"
EMAIL_PASS="*****************"

TELEGRAM_CHAT_ID="*****************"
TELEGRAM_BOT_TOKEN="*****************"
```

### Prisma

# generate Prisma client
```bash
npx prisma generate
```

# apply migrations
```bash
npx prisma migrate dev
```

### Running App

# development
```bash
npm run start:dev
```
# production
```bash
npm run build
npm run start:prod
```
