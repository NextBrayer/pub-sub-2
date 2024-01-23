-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mqtt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT,
    "username" TEXT,
    "password" TEXT,
    "topic" TEXT,
    "mqttId" INTEGER,
    CONSTRAINT "Mqtt_mqttId_fkey" FOREIGN KEY ("mqttId") REFERENCES "Type" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Mqtt" ("id", "mqttId", "password", "topic", "url", "username") SELECT "id", "mqttId", "password", "topic", "url", "username" FROM "Mqtt";
DROP TABLE "Mqtt";
ALTER TABLE "new_Mqtt" RENAME TO "Mqtt";
CREATE TABLE "new_Serial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "port" TEXT,
    "baudRate" INTEGER,
    "serialId" INTEGER,
    CONSTRAINT "Serial_serialId_fkey" FOREIGN KEY ("serialId") REFERENCES "Type" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Serial" ("baudRate", "id", "port", "serialId") SELECT "baudRate", "id", "port", "serialId" FROM "Serial";
DROP TABLE "Serial";
ALTER TABLE "new_Serial" RENAME TO "Serial";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
