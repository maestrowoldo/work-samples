-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "celular" TEXT,
    "mensagem" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'novo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "imagem" TEXT,
    "tags" TEXT[],
    "autor" TEXT NOT NULL DEFAULT 'Wolkendo Arias',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_createdAt_idx" ON "Contact"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_published_idx" ON "BlogPost"("published");

-- CreateIndex
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_createdAt_idx" ON "BlogPost"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_email_key" ON "Newsletter"("email");

-- CreateIndex
CREATE INDEX "Newsletter_email_idx" ON "Newsletter"("email");
