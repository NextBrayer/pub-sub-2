/*
  Warnings:

  - You are about to drop the `Mqtt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Serial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MqttToType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SerialToType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_MqttToType_B_index";

-- DropIndex
DROP INDEX "_MqttToType_AB_unique";

-- DropIndex
DROP INDEX "_SerialToType_B_index";

-- DropIndex
DROP INDEX "_SerialToType_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Mqtt";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Serial";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Type";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_MqttToType";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_SerialToType";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Source" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "details" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Main" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    CONSTRAINT "Main_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Main_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Main" ("destinationId", "id", "name", "sourceId") SELECT "destinationId", "id", "name", "sourceId" FROM "Main";
DROP TABLE "Main";
ALTER TABLE "new_Main" RENAME TO "Main";
CREATE UNIQUE INDEX "Main_name_key" ON "Main"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
