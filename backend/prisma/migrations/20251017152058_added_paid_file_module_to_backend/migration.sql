-- CreateTable
CREATE TABLE "downloadable_file" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "file_url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "downloads_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "downloadable_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_payment" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'razorpay',
    "razorpay_order_id" TEXT,
    "razorpay_payment_id" TEXT,
    "razorpay_signature" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchased_file" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "purchased_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchased_file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "downloadable_file_slug_key" ON "downloadable_file"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "file_payment_razorpay_order_id_key" ON "file_payment"("razorpay_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "file_payment_razorpay_payment_id_key" ON "file_payment"("razorpay_payment_id");

-- CreateIndex
CREATE INDEX "file_payment_file_id_idx" ON "file_payment"("file_id");

-- CreateIndex
CREATE INDEX "file_payment_user_id_idx" ON "file_payment"("user_id");

-- CreateIndex
CREATE INDEX "file_payment_status_idx" ON "file_payment"("status");

-- CreateIndex
CREATE INDEX "purchased_file_user_id_idx" ON "purchased_file"("user_id");

-- CreateIndex
CREATE INDEX "purchased_file_file_id_idx" ON "purchased_file"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchased_file_file_id_user_id_key" ON "purchased_file"("file_id", "user_id");

-- AddForeignKey
ALTER TABLE "file_payment" ADD CONSTRAINT "file_payment_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "downloadable_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_payment" ADD CONSTRAINT "file_payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchased_file" ADD CONSTRAINT "purchased_file_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "downloadable_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchased_file" ADD CONSTRAINT "purchased_file_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
