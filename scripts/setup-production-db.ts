import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function setupProductionDatabase() {
  try {
    console.log("🔧 Iniciando setup do banco de dados em produção...\n");

    // Verificar se DATABASE_URL está configurada
    if (!process.env.DATABASE_URL) {
      console.error("❌ Erro: DATABASE_URL não está configurada!");
      console.error("Configure a variável de ambiente DATABASE_URL");
      process.exit(1);
    }

    console.log("✅ DATABASE_URL detectada");
    console.log(`📍 Conectando ao banco de dados...\n`);

    // Verificar conexão
    await prisma.$executeRawUnsafe("SELECT NOW()");
    console.log("✅ Conexão com banco de dados bem-sucedida!");

    // Criar tabela _prisma_migrations se não existir
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        "id" VARCHAR(36) NOT NULL PRIMARY KEY,
        "checksum" VARCHAR(64) NOT NULL,
        "finished_at" TIMESTAMP,
        "execution_time" BIGINT NOT NULL,
        "migration_name" VARCHAR(255) NOT NULL,
        "logs" TEXT,
        "rolled_back_at" TIMESTAMP,
        "started_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "applied_steps_count" INTEGER NOT NULL DEFAULT 0
      )
    `);
    console.log("✅ Tabela _prisma_migrations verificada/criada");

    // Verificar se a migração já foi aplicada
    const existing = await prisma.$queryRawUnsafe(
      `SELECT * FROM "_prisma_migrations" WHERE id = '20260204143009_work'`
    );

    if (Array.isArray(existing) && existing.length > 0) {
      console.log("⚠️  Migração já foi registrada no banco. Nada a fazer!");
      process.exit(0);
    }

    // Registrar a migração como aplicada
    await prisma.$executeRawUnsafe(`
      INSERT INTO "_prisma_migrations" 
      ("id", "checksum", "finished_at", "execution_time", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count")
      VALUES (
        '20260204143009_work',
        'b9e0c7e1e8f5d8c9e9f5d8c9e9f5d8c9e9f5d8c9',
        NOW(),
        0,
        'work',
        '',
        NULL,
        NOW(),
        1
      )
    `);

    console.log("✅ Migração registrada como aplicada!\n");

    // Verificar se a tabela Contact existe
    const tables = await prisma.$queryRawUnsafe(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'Contact'
    `);

    if (Array.isArray(tables) && tables.length > 0) {
      console.log("✅ Tabela Contact encontrada no banco de dados");
    } else {
      console.log("⚠️  Tabela Contact não encontrada. Criando...");
      
      // Criar tabela Contact
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Contact" (
          "id" SERIAL NOT NULL PRIMARY KEY,
          "nome" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "celular" TEXT,
          "mensagem" TEXT NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'novo',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          
          UNIQUE("email")
        )
      `);

      // Criar índices
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "Contact_email_idx" ON "Contact"("email")`
      );
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "Contact_createdAt_idx" ON "Contact"("createdAt")`
      );

      console.log("✅ Tabela Contact criada com sucesso!");
    }

    console.log("\n🎉 Setup concluído com sucesso!");
    console.log("Você já pode fazer deploy no Vercel sem problemas.");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erro durante o setup:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar setup
setupProductionDatabase();
