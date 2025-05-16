-- CreateTable
CREATE TABLE "adminInfo" (
    "id" SERIAL NOT NULL,
    "information" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "adminInfo_pkey" PRIMARY KEY ("id")
);
