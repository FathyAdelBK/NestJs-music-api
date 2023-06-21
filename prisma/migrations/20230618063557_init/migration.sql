/*
  Warnings:

  - You are about to drop the column `songId` on the `Playlist` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_songId_fkey";

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "songId";
