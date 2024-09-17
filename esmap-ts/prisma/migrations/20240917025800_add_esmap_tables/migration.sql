-- CreateTable
CREATE TABLE "calls" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sourceId" INTEGER NOT NULL,
    "cid" TEXT NOT NULL,
    "category" TEXT,
    "geoid" INTEGER,
    "added" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired" DATETIME,
    "meta" TEXT NOT NULL,
    CONSTRAINT "calls_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "calls_geoid_fkey" FOREIGN KEY ("geoid") REFERENCES "geocodes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sources" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "parser" TEXT NOT NULL,
    "update_time" INTEGER NOT NULL,
    "bounds" TEXT,
    "time_zone" TEXT,
    "time_format" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "geocodes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "added" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" DATETIME,
    "results" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "calls_cid_key" ON "calls"("cid");

-- CreateIndex
CREATE UNIQUE INDEX "geocodes_location_key" ON "geocodes"("location");
