-- CreateTable
CREATE TABLE "postImages" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "url" VARCHAR(255),
    "postId" INTEGER NOT NULL,

    CONSTRAINT "postImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "postImages" ADD CONSTRAINT "postImages_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
