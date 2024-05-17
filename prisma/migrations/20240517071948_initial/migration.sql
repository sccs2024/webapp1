-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "apptdate" DATE NOT NULL,
    "update" TEXT NOT NULL,
    "followup" TEXT NOT NULL,
    "nextappt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
