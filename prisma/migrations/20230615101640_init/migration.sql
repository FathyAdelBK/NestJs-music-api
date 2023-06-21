/*
  Warnings:

  - Changed the type of `type` on the `Musician` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MusicianType" AS ENUM ('SINGLE', 'MUSIC_BAND');

-- AlterTable
ALTER TABLE "Musician" DROP COLUMN "type",
ADD COLUMN     "type" "MusicianType" NOT NULL;
