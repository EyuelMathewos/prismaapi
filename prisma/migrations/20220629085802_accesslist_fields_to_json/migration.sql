/*
  Warnings:

  - Changed the type of `fields` on the `accesslist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "accesslist" DROP COLUMN "fields",
ADD COLUMN     "fields" JSONB NOT NULL;
