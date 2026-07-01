-- CreateTable
CREATE TABLE "tontines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "user_id" TEXT NOT NULL,
    "total_members" INTEGER NOT NULL,
    "contribution_amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "frequency" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "current_round" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "rules" TEXT,
    "next_payment_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tontines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tontine_members" (
    "id" TEXT NOT NULL,
    "tontine_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "position" INTEGER NOT NULL,
    "has_received" BOOLEAN NOT NULL DEFAULT false,
    "received_at" TIMESTAMP(3),
    "total_paid" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "tontine_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tontine_contributions" (
    "id" TEXT NOT NULL,
    "tontine_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "round" INTEGER NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_method" TEXT,
    "notes" TEXT,
    "is_paid" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tontine_contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tontine_rotations" (
    "id" TEXT NOT NULL,
    "tontine_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "total_amount" DECIMAL(15,2) NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "tontine_rotations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tontines_user_id_idx" ON "tontines"("user_id");

-- CreateIndex
CREATE INDEX "tontines_status_idx" ON "tontines"("status");

-- CreateIndex
CREATE INDEX "tontine_members_tontine_id_idx" ON "tontine_members"("tontine_id");

-- CreateIndex
CREATE INDEX "tontine_contributions_tontine_id_idx" ON "tontine_contributions"("tontine_id");

-- CreateIndex
CREATE INDEX "tontine_contributions_member_id_idx" ON "tontine_contributions"("member_id");

-- CreateIndex
CREATE INDEX "tontine_contributions_tontine_id_round_idx" ON "tontine_contributions"("tontine_id", "round");

-- CreateIndex
CREATE INDEX "tontine_rotations_tontine_id_idx" ON "tontine_rotations"("tontine_id");

-- CreateIndex
CREATE INDEX "tontine_rotations_member_id_idx" ON "tontine_rotations"("member_id");

-- CreateIndex
CREATE UNIQUE INDEX "tontine_rotations_tontine_id_round_key" ON "tontine_rotations"("tontine_id", "round");

-- AddForeignKey
ALTER TABLE "tontines" ADD CONSTRAINT "tontines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tontine_members" ADD CONSTRAINT "tontine_members_tontine_id_fkey" FOREIGN KEY ("tontine_id") REFERENCES "tontines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tontine_contributions" ADD CONSTRAINT "tontine_contributions_tontine_id_fkey" FOREIGN KEY ("tontine_id") REFERENCES "tontines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tontine_contributions" ADD CONSTRAINT "tontine_contributions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "tontine_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tontine_rotations" ADD CONSTRAINT "tontine_rotations_tontine_id_fkey" FOREIGN KEY ("tontine_id") REFERENCES "tontines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tontine_rotations" ADD CONSTRAINT "tontine_rotations_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "tontine_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
