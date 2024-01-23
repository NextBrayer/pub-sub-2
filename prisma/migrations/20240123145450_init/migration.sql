/*
  Warnings:

  - You are about to drop the `Destination` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Main` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Source` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Destination";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Main";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Source";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    CONSTRAINT "Config_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Transport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Config_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Transport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "details" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Config_name_key" ON "Config"("name");
