-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "processorId" TEXT NOT NULL,
    "graphicsId" TEXT NOT NULL,
    "powersupplyId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "motherboardId" TEXT NOT NULL,
    "coolerId" TEXT NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GraphicsInConfig" (
    "configId" TEXT NOT NULL,
    "gpuId" TEXT NOT NULL,

    CONSTRAINT "GraphicsInConfig_pkey" PRIMARY KEY ("configId","gpuId")
);

-- CreateTable
CREATE TABLE "FansInConfig" (
    "configId" TEXT NOT NULL,
    "fanId" TEXT NOT NULL,

    CONSTRAINT "FansInConfig_pkey" PRIMARY KEY ("configId","fanId")
);

-- CreateTable
CREATE TABLE "DriveInConfig" (
    "configId" TEXT NOT NULL,
    "driveId" TEXT NOT NULL,

    CONSTRAINT "DriveInConfig_pkey" PRIMARY KEY ("configId","driveId")
);

-- CreateTable
CREATE TABLE "MemoryInConfig" (
    "configId" TEXT NOT NULL,
    "memoryId" TEXT NOT NULL,

    CONSTRAINT "MemoryInConfig_pkey" PRIMARY KEY ("configId","memoryId")
);

-- CreateTable
CREATE TABLE "Drive" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Drive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motherboard" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Motherboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Processor" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Processor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cooler" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Cooler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Powersupply" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Powersupply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Graphics" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Graphics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fan" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Fan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_processorId_fkey" FOREIGN KEY ("processorId") REFERENCES "Processor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_motherboardId_fkey" FOREIGN KEY ("motherboardId") REFERENCES "Motherboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_powersupplyId_fkey" FOREIGN KEY ("powersupplyId") REFERENCES "Powersupply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_coolerId_fkey" FOREIGN KEY ("coolerId") REFERENCES "Cooler"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraphicsInConfig" ADD CONSTRAINT "GraphicsInConfig_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraphicsInConfig" ADD CONSTRAINT "GraphicsInConfig_gpuId_fkey" FOREIGN KEY ("gpuId") REFERENCES "Graphics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FansInConfig" ADD CONSTRAINT "FansInConfig_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FansInConfig" ADD CONSTRAINT "FansInConfig_fanId_fkey" FOREIGN KEY ("fanId") REFERENCES "Fan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriveInConfig" ADD CONSTRAINT "DriveInConfig_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriveInConfig" ADD CONSTRAINT "DriveInConfig_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "Drive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryInConfig" ADD CONSTRAINT "MemoryInConfig_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryInConfig" ADD CONSTRAINT "MemoryInConfig_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
