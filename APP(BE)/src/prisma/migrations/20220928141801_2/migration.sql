/*
  Warnings:

  - The primary key for the `Chatroom` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `chatroomId` on the `Chatroom` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Friends` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `followerId` on the `Friends` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `followingId` on the `Friends` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `messageId` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `senderId` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `belongChatRoomId` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Notice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `noticeId` on the `Notice` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `belongChatRoomId` on the `Notice` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `userId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `UsersOnChatrooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `chatroomId` on the `UsersOnChatrooms` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `UsersOnChatrooms` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `Friends` DROP FOREIGN KEY `Friends_followerId_fkey`;

-- DropForeignKey
ALTER TABLE `Friends` DROP FOREIGN KEY `Friends_followingId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_belongChatRoomId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `Notice` DROP FOREIGN KEY `Notice_belongChatRoomId_fkey`;

-- DropForeignKey
ALTER TABLE `UsersOnChatrooms` DROP FOREIGN KEY `UsersOnChatrooms_chatroomId_fkey`;

-- DropForeignKey
ALTER TABLE `UsersOnChatrooms` DROP FOREIGN KEY `UsersOnChatrooms_userId_fkey`;

-- AlterTable
ALTER TABLE `Chatroom` DROP PRIMARY KEY,
    MODIFY `chatroomId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`chatroomId`);

-- AlterTable
ALTER TABLE `Friends` DROP PRIMARY KEY,
    MODIFY `followerId` INTEGER NOT NULL,
    MODIFY `followingId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`followerId`, `followingId`);

-- AlterTable
ALTER TABLE `Message` DROP PRIMARY KEY,
    MODIFY `messageId` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `senderId` INTEGER NOT NULL,
    MODIFY `belongChatRoomId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`messageId`);

-- AlterTable
ALTER TABLE `Notice` DROP PRIMARY KEY,
    MODIFY `noticeId` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `belongChatRoomId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`noticeId`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `userId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`userId`);

-- AlterTable
ALTER TABLE `UsersOnChatrooms` DROP PRIMARY KEY,
    MODIFY `chatroomId` INTEGER NOT NULL,
    MODIFY `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`chatroomId`, `userId`);

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersOnChatrooms` ADD CONSTRAINT `UsersOnChatrooms_chatroomId_fkey` FOREIGN KEY (`chatroomId`) REFERENCES `Chatroom`(`chatroomId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersOnChatrooms` ADD CONSTRAINT `UsersOnChatrooms_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notice` ADD CONSTRAINT `Notice_belongChatRoomId_fkey` FOREIGN KEY (`belongChatRoomId`) REFERENCES `Chatroom`(`chatroomId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_belongChatRoomId_fkey` FOREIGN KEY (`belongChatRoomId`) REFERENCES `Chatroom`(`chatroomId`) ON DELETE RESTRICT ON UPDATE CASCADE;
