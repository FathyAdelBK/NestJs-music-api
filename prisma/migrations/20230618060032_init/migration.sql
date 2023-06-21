-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "songId" INTEGER;

-- CreateTable
CREATE TABLE "MusicFavourites" (
    "musicId" INTEGER NOT NULL,
    "favouriteId" INTEGER NOT NULL,

    CONSTRAINT "MusicFavourites_pkey" PRIMARY KEY ("musicId","favouriteId")
);

-- CreateTable
CREATE TABLE "SongPlaylists" (
    "playlistId" INTEGER NOT NULL,
    "songId" INTEGER NOT NULL,

    CONSTRAINT "SongPlaylists_pkey" PRIMARY KEY ("songId","playlistId")
);

-- CreateTable
CREATE TABLE "SongFavourites" (
    "songId" INTEGER NOT NULL,
    "favouriteId" INTEGER NOT NULL,

    CONSTRAINT "SongFavourites_pkey" PRIMARY KEY ("songId","favouriteId")
);

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicFavourites" ADD CONSTRAINT "MusicFavourites_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "Music"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicFavourites" ADD CONSTRAINT "MusicFavourites_favouriteId_fkey" FOREIGN KEY ("favouriteId") REFERENCES "Favourite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongPlaylists" ADD CONSTRAINT "SongPlaylists_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongPlaylists" ADD CONSTRAINT "SongPlaylists_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongFavourites" ADD CONSTRAINT "SongFavourites_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongFavourites" ADD CONSTRAINT "SongFavourites_favouriteId_fkey" FOREIGN KEY ("favouriteId") REFERENCES "Favourite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
