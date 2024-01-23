/*
  Warnings:

  - Made the column `baudRate` on table `Serial` required. This step will fail if there are existing NULL values in that column.
  - Made the column `port` on table `Serial` required. This step will fail if there are existing NULL values in that column.
  - Made the column `topic` on table `Mqtt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `Mqtt` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `mainId` to the `Type` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Serial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "port" TEXT NOT NULL,
    "baudRate" INTEGER NOT NULL
);
INSERT INTO "new_Serial" ("baudRate", "id", "port") SELECT "baudRate", "id", "port" FROM "Serial";
DROP TABLE "Serial";
ALTER TABLE "new_Serial" RENAME TO "Serial";
CREATE TABLE "new_Mqtt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "topic" TEXT NOT NULL
);
INSERT INTO "new_Mqtt" ("id", "password", "topic", "url", "username") SELECT "id", "password", "topic", "url", "username" FROM "Mqtt";
DROP TABLE "Mqtt";
ALTER TABLE "new_Mqtt" RENAME TO "Mqtt";
CREATE TABLE "new_Type" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sourceId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "mainId" INTEGER NOT NULL,
    CONSTRAINT "Type_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Main" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Type_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Main" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Type" ("destinationId", "id", "sourceId") SELECT "destinationId", "id", "sourceId" FROM "Type";
DROP TABLE "Type";
ALTER TABLE "new_Type" RENAME TO "Type";
CREATE UNIQUE INDEX "Type_sourceId_key" ON "Type"("sourceId");
CREATE UNIQUE INDEX "Type_destinationId_key" ON "Type"("destinationId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
