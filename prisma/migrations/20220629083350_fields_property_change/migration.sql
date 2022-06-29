/*
  Warnings:

  - The `fields` column on the `accesslist` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "accesslist" DROP COLUMN "fields",
ADD COLUMN     "fields" TEXT[];
