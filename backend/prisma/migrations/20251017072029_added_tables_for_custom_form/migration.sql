-- CreateTable
CREATE TABLE "form" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "price" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field" (
    "id" TEXT NOT NULL,
    "form_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" JSONB,
    "order" INTEGER NOT NULL,
    "meta" JSONB,

    CONSTRAINT "field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission" (
    "id" TEXT NOT NULL,
    "form_id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "user_id" BIGINT NOT NULL,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_payments" (
    "id" TEXT NOT NULL,
    "form_id" TEXT NOT NULL,
    "submission_id" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'razorpay',
    "provider_payment_id" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL,
    "metadata" JSONB,
    "upi_transaction_id" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "form_slug_key" ON "form"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "form_payments_submission_id_key" ON "form_payments"("submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "form_payments_provider_payment_id_key" ON "form_payments"("provider_payment_id");

-- AddForeignKey
ALTER TABLE "field" ADD CONSTRAINT "field_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_payments" ADD CONSTRAINT "form_payments_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_payments" ADD CONSTRAINT "form_payments_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
