/*
  Warnings:

  - A unique constraint covering the columns `[license]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - Made the column `license` on table `Driver` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Driver" ALTER COLUMN "license" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Driver_license_key" ON "Driver"("license");
