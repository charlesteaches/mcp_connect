-- CreateTable
CREATE TABLE "lists" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "slug" TEXT,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" SERIAL NOT NULL,
    "link_id" INTEGER,
    "title" TEXT,
    "description" TEXT,
    "slug" TEXT,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "listId" INTEGER,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lists_slug_key" ON "lists"("slug");

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
