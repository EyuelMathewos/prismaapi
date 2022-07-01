/*
  Warnings:

  - You are about to drop the column `accessId` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the `accesslist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `accesstokens` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `action` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conditions` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fields` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "accesstokens" DROP CONSTRAINT "accesstokens_clientId_fkey";

-- DropForeignKey
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_accessId_fkey";

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "accessId",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "conditions" JSONB NOT NULL,
ADD COLUMN     "fields" JSONB NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL;

-- DropTable
DROP TABLE "accesslist";

-- DropTable
DROP TABLE "accesstokens";
