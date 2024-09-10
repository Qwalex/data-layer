-- CreateTable
CREATE TABLE "dataLayers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "columns" TEXT NOT NULL,
    "dataSource" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "dataLayers_name_key" ON "dataLayers"("name");
