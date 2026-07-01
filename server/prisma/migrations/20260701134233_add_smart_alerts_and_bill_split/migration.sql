-- CreateTable
CREATE TABLE "smart_alerts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "action_url" TEXT,
    "action_label" TEXT,
    "metadata" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "smart_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bill_splits" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bill_splits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bill_participants" (
    "id" TEXT NOT NULL,
    "bill_split_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "share_amount" DOUBLE PRECISION NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "bill_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bill_payments" (
    "id" TEXT NOT NULL,
    "bill_split_id" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_method" TEXT,
    "transaction_id" TEXT,
    "paid_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "bill_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "smart_alerts_user_id_idx" ON "smart_alerts"("user_id");

-- CreateIndex
CREATE INDEX "smart_alerts_user_id_is_read_idx" ON "smart_alerts"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "smart_alerts_user_id_created_at_idx" ON "smart_alerts"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "bill_splits_user_id_idx" ON "bill_splits"("user_id");

-- CreateIndex
CREATE INDEX "bill_splits_user_id_status_idx" ON "bill_splits"("user_id", "status");

-- CreateIndex
CREATE INDEX "bill_splits_created_at_idx" ON "bill_splits"("created_at");

-- CreateIndex
CREATE INDEX "bill_participants_bill_split_id_idx" ON "bill_participants"("bill_split_id");

-- CreateIndex
CREATE INDEX "bill_payments_bill_split_id_idx" ON "bill_payments"("bill_split_id");

-- CreateIndex
CREATE INDEX "bill_payments_participant_id_idx" ON "bill_payments"("participant_id");

-- AddForeignKey
ALTER TABLE "smart_alerts" ADD CONSTRAINT "smart_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_splits" ADD CONSTRAINT "bill_splits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_participants" ADD CONSTRAINT "bill_participants_bill_split_id_fkey" FOREIGN KEY ("bill_split_id") REFERENCES "bill_splits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_payments" ADD CONSTRAINT "bill_payments_bill_split_id_fkey" FOREIGN KEY ("bill_split_id") REFERENCES "bill_splits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_payments" ADD CONSTRAINT "bill_payments_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "bill_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
