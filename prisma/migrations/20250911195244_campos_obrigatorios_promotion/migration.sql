-- AlterTable
ALTER TABLE "public"."Promotion" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL;
