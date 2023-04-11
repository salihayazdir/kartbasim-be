CREATE TABLE "banks"(
    "bank_id" INT IDENTITY(1, 1) PRIMARY KEY,
    "bank_name" NVARCHAR(255) NOT NULL,
    "is_active" BIT NOT NULL
);

CREATE UNIQUE INDEX "banks_bank_name_unique" ON
    "banks"("bank_name");