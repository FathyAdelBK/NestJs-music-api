/*
  Warnings:

  - The primary key for the `MusicPlaylists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MusicPlaylists` table. All the data in the column will be lost.
  - Made the column `musicId` on table `MusicPlaylists` required. This step will fail if there are existing NULL values in that column.
  - Made the column `playlistId` on table `MusicPlaylists` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MusicPlaylists" DROP CONSTRAINT "MusicPlaylists_musicId_fkey";

-- DropForeignKey
ALTER TABLE "MusicPlaylists" DROP CONSTRAINT "MusicPlaylists_playlistId_fkey";

-- AlterTable
ALTER TABLE "MusicPlaylists" DROP CONSTRAINT "MusicPlaylists_pkey",
DROP COLUMN "id",
ALTER COLUMN "musicId" SET NOT NULL,
ALTER COLUMN "playlistId" SET NOT NULL,
ADD CONSTRAINT "MusicPlaylists_pkey" PRIMARY KEY ("musicId", "playlistId");

-- AddForeignKey
ALTER TABLE "MusicPlaylists" ADD CONSTRAINT "MusicPlaylists_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "Music"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicPlaylists" ADD CONSTRAINT "MusicPlaylists_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
