/*
  Warnings:

  - You are about to drop the column `destinationId` on the `Type` table. All the data in the column will be lost.
  - You are about to drop the column `mainId` on the `Type` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `Type` table. All the data in the column will be lost.
  - Added the required column `destinationId` to the `Main` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceId` to the `Main` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Type" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);
INSERT INTO "new_Type" ("id") SELECT "id" FROM "Type";
DROP TABLE "Type";
ALTER TABLE "new_Type" RENAME TO "Type";
CREATE TABLE "new_Main" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    CONSTRAINT "Main_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Main_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Main" ("id", "name") SELECT "id", "name" FROM "Main";
DROP TABLE "Main";
ALTER TABLE "new_Main" RENAME TO "Main";
CREATE UNIQUE INDEX "Main_name_key" ON "Main"("name");
CREATE UNIQUE INDEX "Main_sourceId_key" ON "Main"("sourceId");
CREATE UNIQUE INDEX "Main_destinationId_key" ON "Main"("destinationId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
