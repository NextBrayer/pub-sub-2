-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mqtt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT,
    "username" TEXT,
    "password" TEXT,
    "topic" TEXT
);
INSERT INTO "new_Mqtt" ("id", "password", "topic", "url", "username") SELECT "id", "password", "topic", "url", "username" FROM "Mqtt";
DROP TABLE "Mqtt";
ALTER TABLE "new_Mqtt" RENAME TO "Mqtt";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
