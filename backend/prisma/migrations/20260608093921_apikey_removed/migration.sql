/*
  Warnings:

  - You are about to drop the `apiKey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "apiKey" DROP CONSTRAINT "apiKey_userId_fkey";

-- DropTable
DROP TABLE "apiKey";
