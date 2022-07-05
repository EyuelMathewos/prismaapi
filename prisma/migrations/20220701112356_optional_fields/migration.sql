-- AlterTable
ALTER TABLE "permissions" ALTER COLUMN "conditions" DROP NOT NULL,
ALTER COLUMN "fields" DROP NOT NULL;
