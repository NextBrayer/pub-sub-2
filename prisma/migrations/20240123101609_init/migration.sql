-- CreateTable
CREATE TABLE "Serial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "port" TEXT NOT NULL,
    "baudRate" INTEGER NOT NULL,
    "serialId" INTEGER,
    CONSTRAINT "Serial_serialId_fkey" FOREIGN KEY ("serialId") REFERENCES "Type" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mqtt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "topic" TEXT NOT NULL,
    "mqttId" INTEGER,
    CONSTRAINT "Mqtt_mqttId_fkey" FOREIGN KEY ("mqttId") REFERENCES "Type" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Main" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Type" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sourceId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    CONSTRAINT "Type_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Main" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Type_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Main" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Main_name_key" ON "Main"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Type_sourceId_key" ON "Type"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Type_destinationId_key" ON "Type"("destinationId");
