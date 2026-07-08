# AGENTS.md

Instrucoes para agentes trabalhando neste repositorio.

## Visao Geral

- Projeto: portfolio profissional em Next.js, React e TypeScript.
- Stack principal: Next.js 16, React 19, Tailwind CSS, Framer Motion, Prisma e Vitest.
- Gerenciador atual: o repositorio tem `pnpm-lock.yaml`, mas os scripts do README usam `npm`. Antes de instalar dependencias, preserve o lockfile existente e confirme a escolha do gerenciador se for necessario alterar dependencias.

## Estrutura Relevante

- `src/app/`: rotas do App Router, layouts, paginas, sitemap, robots e API routes.
- `src/app/[locale]/`: versoes localizadas das paginas.
- `src/components/`: componentes de UI e secoes do portfolio.
- `src/components/ui/`: componentes reutilizaveis basicos.
- `src/lib/`: utilitarios, validacoes, metadata, i18n e logica do blog.
- `src/lib/blog/generator/`: geracao automatizada de posts.
- `prisma/`: schema e migrations do banco.
- `scripts/`: scripts auxiliares, incluindo geracao de blog e setup de banco.
- `public/`: assets estaticos.

## Comandos

Use os scripts do `package.json`:

```bash
npm run dev
npm run build
npm run lint
npm test
npm run test:watch
npm run generate:blog
npm run prisma:generate
npm run prisma:migrate
```

Observacoes:

- `npm run build` executa `prisma migrate deploy` antes do `next build` e continua mesmo se a migration falhar.
- `postinstall` executa `prisma generate`.
- Variaveis de ambiente locais ficam em `.env.local`; nao exponha segredos.
- Use `.env.example` como referencia para novas variaveis.

## Padroes de Codigo

- Prefira TypeScript estrito e componentes React funcionais.
- Mantenha codigo de UI alinhado aos componentes existentes em `src/components/` e `src/components/ui/`.
- Para icones, use bibliotecas ja instaladas, especialmente `lucide-react` quando fizer sentido.
- Para validacao de dados, use Zod e os padroes em `src/lib/validations.ts`.
- Para estilos, prefira Tailwind e os arquivos CSS ja existentes quando houver padrao local.
- Evite refatoracoes amplas sem necessidade direta da tarefa.
- Preserve suporte a localizacao quando editar paginas ou conteudo que exista tambem em `src/app/[locale]/`.

## Testes e Verificacao

- Para alteracoes em logica de negocio, geracao de blog, validacoes ou API routes, rode `npm test`.
- Para alteracoes de lint/formatacao ou componentes compartilhados, rode `npm run lint`.
- Para alteracoes que afetam build, rotas, Prisma ou metadata, rode `npm run build` quando viavel.
- Adicione ou atualize testes proximos ao codigo alterado. O projeto usa Vitest e Testing Library.

## Prisma e Banco

- Nao altere migrations existentes sem motivo explicito.
- Ao mudar `prisma/schema.prisma`, gere migration nova com `npm run prisma:migrate` quando houver banco local adequado.
- Se apenas precisar atualizar o client apos mudanca de schema, use `npm run prisma:generate`.

## Blog

- O conteudo e a geracao do blog ficam em `src/lib/blog/` e `scripts/generate-blog.ts`.
- Ao mexer na geracao, verifique os testes em `src/lib/blog/**/*.test.ts`.
- Evite chamadas externas em testes; siga os mocks e padroes ja usados.

## Git e Arquivos

- Nao reverta mudancas do usuario.
- Nao commite automaticamente sem pedido explicito.
- Nao edite `.env.local` para registrar exemplos; atualize `.env.example`.
- Nao inclua arquivos gerados pesados ou caches (`.next/`, `node_modules/`, outputs temporarios).
