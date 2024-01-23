/*
  Warnings:

  - You are about to drop the column `serialId` on the `Serial` table. All the data in the column will be lost.
  - You are about to drop the column `mqttId` on the `Mqtt` table. All the data in the column will be lost.
  - Made the column `topic` on table `Mqtt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `Mqtt` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "_SerialToType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_SerialToType_A_fkey" FOREIGN KEY ("A") REFERENCES "Serial" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SerialToType_B_fkey" FOREIGN KEY ("B") REFERENCES "Type" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MqttToType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MqttToType_A_fkey" FOREIGN KEY ("A") REFERENCES "Mqtt" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MqttToType_B_fkey" FOREIGN KEY ("B") REFERENCES "Type" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Serial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "port" TEXT,
    "baudRate" INTEGER
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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_SerialToType_AB_unique" ON "_SerialToType"("A", "B");

-- CreateIndex
CREATE INDEX "_SerialToType_B_index" ON "_SerialToType"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MqttToType_AB_unique" ON "_MqttToType"("A", "B");

-- CreateIndex
CREATE INDEX "_MqttToType_B_index" ON "_MqttToType"("B");
