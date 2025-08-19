-- CreateEnum
CREATE TYPE "ImageStatus" AS ENUM ('QUEUED', 'PROCESSING', 'DONE', 'ERROR');

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "originalKey" TEXT NOT NULL,
    "processedKey" TEXT,
    "status" "ImageStatus" NOT NULL DEFAULT 'QUEUED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);
