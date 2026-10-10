-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "About" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "avatar" TEXT NOT NULL DEFAULT '',
    "intro" TEXT NOT NULL DEFAULT '',
    "contact" TEXT NOT NULL DEFAULT ''
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
