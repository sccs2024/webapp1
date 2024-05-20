/*
  Warnings:

  - Added the required column `doctortype` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "doctortype" TEXT NOT NULL;
