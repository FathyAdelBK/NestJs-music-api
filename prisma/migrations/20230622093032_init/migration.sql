-- AlterTable
ALTER TABLE "Favourite" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Music" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Musician" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "MusicianAlbum" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Singer" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "SingerAlbum" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Singer" ADD CONSTRAINT "Singer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Musician" ADD CONSTRAINT "Musician_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicianAlbum" ADD CONSTRAINT "MusicianAlbum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SingerAlbum" ADD CONSTRAINT "SingerAlbum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Music" ADD CONSTRAINT "Music_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
