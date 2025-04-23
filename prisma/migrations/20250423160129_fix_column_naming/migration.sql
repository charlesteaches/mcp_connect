/*
  Warnings:

  - You are about to drop the column `listId` on the `links` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "links" DROP CONSTRAINT "links_listId_fkey";

-- AlterTable
ALTER TABLE "links" DROP COLUMN "listId",
ADD COLUMN     "list_id" INTEGER;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
