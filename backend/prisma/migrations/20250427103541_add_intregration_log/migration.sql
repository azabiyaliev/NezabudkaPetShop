-- CreateTable
CREATE TABLE "integration_logs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestBody" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,

    CONSTRAINT "integration_logs_pkey" PRIMARY KEY ("id")
);
