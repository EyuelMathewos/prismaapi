-- CreateTable
CREATE TABLE "accesslist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "conditions" JSONB NOT NULL,
    "fields" JSONB NOT NULL,

    CONSTRAINT "accesslist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "accessId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accesslist_name_key" ON "accesslist"("name");

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_accessId_fkey" FOREIGN KEY ("accessId") REFERENCES "accesslist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
