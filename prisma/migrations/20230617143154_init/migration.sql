/*
  Warnings:

  - You are about to drop the `_MusicToPlaylist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MusicToPlaylist" DROP CONSTRAINT "_MusicToPlaylist_A_fkey";

-- DropForeignKey
ALTER TABLE "_MusicToPlaylist" DROP CONSTRAINT "_MusicToPlaylist_B_fkey";

-- DropTable
DROP TABLE "_MusicToPlaylist";

-- CreateTable
CREATE TABLE "MusicPlaylists" (
    "id" SERIAL NOT NULL,
    "musicId" INTEGER,
    "playlistId" INTEGER,

    CONSTRAINT "MusicPlaylists_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MusicPlaylists" ADD CONSTRAINT "MusicPlaylists_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "Music"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicPlaylists" ADD CONSTRAINT "MusicPlaylists_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
