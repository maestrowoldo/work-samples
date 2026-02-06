#  Portfólio Profissional - Wolkendo Arias

Uma aplicação web moderna, responsiva e profissional construída com **Next.js 16**, **TypeScript**, **Tailwind CSS** e **Framer Motion**.

##  Características Principais

- ✅ **Design Moderno & Animações** - Framer Motion para efeitos visuais fluidos
- ✅ **Totalmente Responsivo** - Mobile-first design
- ✅ **SEO Otimizado** - Sitemap, Robots.txt, Schema JSON
- ✅ **Blog Integrado** - Sistema de artigos com roteamento dinâmico
- ✅ **Validação de Formulários** - Zod + React Hook Form
- ✅ **Performance** - Image optimization automática
- ✅ **Banco de Dados** - Prisma ORM com PostgreSQL (pronto)
- ✅ **Analytics** - Vercel Analytics integrado

## Tech Stack

- **Next.js 16** - Framework React
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animações
- **Zod** - Validação de schema
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados

##  Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/portfolio.git
cd portfolio

# Instale as dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx        # Layout raiz
│   ├── page.tsx          # Página inicial
│   ├── blog/             # Seção de blog
│   ├── api/              # API endpoints
│   └── providers.tsx     # Context providers
├── components/
│   ├── ui/               # Componentes reutilizáveis
│   ├── Navbar.tsx        # Navegação
│   ├── Hero.tsx          # Seção hero
│   ├── About.tsx         # Sobre mim
│   ├── Skills.tsx        # Tecnologias
│   ├── Experience.tsx    # Experiência
│   ├── Projects.tsx      # Projetos
│   ├── Contact.tsx       # Contato
│   └── Footer.tsx        # Rodapé
├── lib/
│   ├── validations.ts    # Schemas Zod
│   └── email.ts          # Utilitários
└── public/               # Arquivos estáticos
```

## Scripts Disponíveis

```bash
npm run dev           # Desenvolvimento
npm run build         # Build para produção
npm run start         # Produção
npm run lint          # ESLint
npm run prisma:generate  # Gerar cliente Prisma
npm run prisma:migrate   # Migrations do banco
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente

Crie `.env.local`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-app
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Banco de Dados

```bash
# Criar banco
createdb portfolio

# Migrations
npx prisma migrate dev

# Visualizar dados
npx prisma studio
```

## Customização

- **Cores**: Edite `tailwind.config.ts`
- **Conteúdo**: Modifique os componentes em `src/components/`
- **Blog**: Adicione artigos em `src/app/blog/[slug]/page.tsx`

## Deploy com Vercel

1. Push para GitHub
2. Conecte no Vercel
3. Configure variáveis de ambiente
4. Deploy automático

## Contato

- **Email**: contact@wolkendoarias.com
- **LinkedIn**: linkedin.com/in/wolkendo
- **GitHub**: github.com/wolkendo

## Licença

MIT - Desenvolvido com ❤️ por Wolkendo Arias
