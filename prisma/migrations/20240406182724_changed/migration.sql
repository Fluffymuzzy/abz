/*
  Warnings:

  - Changed the type of `registration_timestamp` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "registration_timestamp",
ADD COLUMN     "registration_timestamp" INTEGER NOT NULL;
