-- CreateTable
CREATE TABLE "clientInfo" (
    "id" SERIAL NOT NULL,
    "information" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "clientInfo_pkey" PRIMARY KEY ("id")
);
