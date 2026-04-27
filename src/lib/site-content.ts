import { defaultLocale, type Locale } from "@/lib/i18n";
import type { ContactValidationMessages } from "@/lib/validations";

export interface BlogPostContent {
  author: string;
  content: string;
  date: string;
  description: string;
  readTime: number;
  slug: string;
  tags: string[];
  title: string;
}

export interface SiteDictionary {
  about: {
    description: string[];
    heading: string;
    highlight: string;
    pillars: Array<{
      description: string;
      title: string;
    }>;
  };
  assistant: {
    buttonLabel: string;
    ctaLabel: string;
    defaultResponse: string;
    greeting: string;
    headerTitle: string;
    inputPlaceholder: string;
    onlineLabel: string;
    responses: Array<{
      keywords: string[];
      response: string | string[];
    }>;
    suggestionQuestions: string[];
    typingLabel: string;
  };
  blog: {
    backLabel: string;
    byLabel: string;
    emptyTitle: string;
    metadataDescription: string;
    metadataTitle: string;
    posts: BlogPostContent[];
    previewDescription: string;
    previewReadLabel: string;
    previewTitle: string;
    previewTitleAccent: string;
    readTimeLabel: string;
    title: string;
    viewAllLabel: string;
  };
  contactPage: {
    metadataDescription: string;
    metadataTitle: string;
    subtitle: string;
    title: string;
  };
  contactSection: {
    description: string;
    form: {
      cellphoneLabel: string;
      cellphonePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      errorMessage: string;
      messageLabel: string;
      messagePlaceholder: string;
      nameLabel: string;
      namePlaceholder: string;
      submitIdle: string;
      submitLoading: string;
      successMessage: string;
      validation: ContactValidationMessages;
    };
    heading: string;
    highlight: string;
    infoCards: Array<{
      description: string;
      title: string;
    }>;
  };
  curriculum: {
    certifications: string[];
    contact: {
      location: string;
    };
    downloadFileName: string;
    downloadLabel: string;
    generatingLabel: string;
    headerRole: string;
    languages: Array<{
      language: string;
      level: string;
    }>;
    metadataDescription: string;
    metadataTitle: string;
    profileSummary: string;
    projects: Array<{
      description: string;
      technologies: string[];
      title: string;
    }>;
    sections: {
      certifications: string;
      education: string;
      experience: string;
      languages: string;
      professionalSummary: string;
      projects: string;
      technicalSkills: string;
    };
    skills: Array<{
      area: string;
      skills: string;
    }>;
    subtitle: string;
    backLabel: string;
    education: Array<{
      course: string;
      institution: string;
      period: string;
    }>;
    experience: Array<{
      company: string;
      descriptions: string[];
      period: string;
      role: string;
    }>;
  };
  experience: {
    description: string;
    heading: string;
    highlight: string;
    items: Array<{
      company: string;
      description: string;
      period: string;
      skills: string[];
      title: string;
    }>;
  };
  footer: {
    copyright: string;
  };
  hero: {
    badges: string[];
    ctaPrimary: string;
    ctaSecondary: string;
    description: string;
    eyebrow: string;
    profileAlt: string;
    proofItems: Array<{
      label: string;
      value: string;
    }>;
    resumeLabel: string;
    socialGitHub: string;
    socialLinkedIn: string;
    title: string;
    titleHighlight: string;
  };
  homeMeta: {
    description: string;
    keywords: string[];
    title: string;
  };
  howIWork: {
    asideDescription: string;
    asideEyebrow: string;
    asideTitle: string;
    description: string;
    heading: string;
    highlight: string;
    signals: string[];
    workflow: Array<{
      description: string;
      step: string;
      title: string;
    }>;
  };
  navbar: {
    contactCta: string;
    cvLabel: string;
    localeSwitcherLabel: string;
    links: Array<{
      href: string;
      label: string;
    }>;
    mobileCvLabel: string;
  };
  projects: {
    challengeLabel: string;
    deliveryLabel: string;
    description: string;
    heading: string;
    highlight: string;
    items: Array<{
      category: string;
      challenge: string;
      delivery: string;
      description: string;
      href: string;
      image: string;
      tag: string;
      tech: string[];
      title: string;
    }>;
    viewMoreLabel: string;
  };
  techMarquee: {
    accent: string;
    title: string;
  };
}

const ptBlogPosts: BlogPostContent[] = [
  {
    slug: "introducao-nextjs",
    title: "Introdução ao Next.js 16",
    description: "Aprenda os fundamentos do Next.js e como criar aplicações web modernas.",
    content: `# Introdução ao Next.js 16

Next.js é um framework React poderoso que simplifica o desenvolvimento de aplicações web modernas. Neste artigo, vou resumir os pontos mais importantes para começar com a base certa.

## Por que usar Next.js?

- Renderização híbrida para equilibrar performance e experiência.
- App Router com composição mais clara entre layout, dados e páginas.
- Rotas de API e Server Components na mesma aplicação.
- Otimizações nativas para imagens, fontes e navegação.

## Como eu penso no uso em projetos reais

Quando uso Next.js, meu foco não é só entregar interface bonita. Eu olho para estrutura de rotas, estratégia de dados, validação, deploy e manutenção. Isso evita retrabalho quando o projeto começa a crescer.

## Primeiro passo

Se o objetivo é montar um produto web profissional, vale começar pela arquitetura de páginas, componentes compartilhados e regras de negócio, não apenas pelo visual inicial.`,
    date: "2025-02-01",
    readTime: 8,
    tags: ["Next.js", "React", "Web Dev"],
    author: "Wolkendo Arias",
  },
  {
    slug: "power-bi-dashboards",
    title: "Criando Dashboards Profissionais com Power BI",
    description: "Guia completo para criar dashboards interativos e impactantes com Power BI.",
    content: `# Criando Dashboards Profissionais com Power BI

Power BI é uma ferramenta forte quando o objetivo é transformar dado bruto em leitura operacional. O ponto principal não é o gráfico em si, e sim a clareza da decisão que ele suporta.

## Base de um bom dashboard

- Modelagem de dados consistente.
- Medidas pensadas para o contexto do negócio.
- Hierarquia visual clara.
- Indicadores que realmente ajudam a agir.

## O que costuma dar errado

Muitos painéis ficam bonitos, mas não respondem perguntas úteis. Sem organização de dados e objetivo claro, o dashboard vira apenas decoração.

## Minha abordagem

Eu costumo começar entendendo quais decisões precisam ser tomadas, depois estruturo os dados e só então desenho a camada visual.`,
    date: "2025-01-28",
    readTime: 12,
    tags: ["Power BI", "Data", "Analytics"],
    author: "Wolkendo Arias",
  },
  {
    slug: "typescript-avancado",
    title: "TypeScript Avançado: Types e Generics",
    description: "Domine tipos avançados e genéricos em TypeScript para código mais seguro.",
    content: `# TypeScript Avançado: Types e Generics

TypeScript melhora muito a manutenção quando é usado com intenção. Tipos avançados não servem para impressionar: eles ajudam a reduzir erro, tornar contratos claros e facilitar evolução.

## Onde generics ajudam

- Reaproveitar funções sem perder segurança.
- Criar utilitários para dados e formulários.
- Modelar respostas de API com mais clareza.

## Tipos utilitários úteis

- Partial<T> para edição incremental.
- Pick<T, K> para recortar contratos.
- Record<K, T> para mapear estados previsíveis.

## Cuidados

Se a tipagem ficar mais difícil de entender do que o problema real, provavelmente passou do ponto. O melhor TypeScript é o que protege sem atrapalhar a leitura.`,
    date: "2025-01-20",
    readTime: 10,
    tags: ["TypeScript", "JavaScript", "Dev"],
    author: "Wolkendo Arias",
  },
];

const enBlogPosts: BlogPostContent[] = [
  {
    slug: "introducao-nextjs",
    title: "Getting Started with Next.js 16",
    description: "Learn the fundamentals of Next.js and how to build modern web applications.",
    content: `# Getting Started with Next.js 16

Next.js is a powerful React framework that simplifies modern web development. In this article, I summarize the core ideas that matter when you want a solid foundation.

## Why use Next.js?

- Hybrid rendering to balance performance and user experience.
- App Router with clearer composition between layout, data, and pages.
- API routes and Server Components in the same application.
- Built-in optimizations for images, fonts, and navigation.

## How I approach real projects

When I use Next.js, I do not focus only on visuals. I look at routing, data strategy, validation, deployment, and maintainability. That prevents rework when the project starts growing.

## First step

If the goal is a professional web product, it is worth starting with page architecture, shared components, and business rules instead of only the initial interface.`,
    date: "2025-02-01",
    readTime: 8,
    tags: ["Next.js", "React", "Web Dev"],
    author: "Wolkendo Arias",
  },
  {
    slug: "power-bi-dashboards",
    title: "Building Professional Dashboards with Power BI",
    description: "A practical guide to creating interactive and decision-ready Power BI dashboards.",
    content: `# Building Professional Dashboards with Power BI

Power BI is most valuable when raw data becomes operational clarity. The key point is not the chart itself, but the decision it helps someone make.

## What a solid dashboard needs

- Consistent data modeling.
- Measures aligned with business context.
- Clear visual hierarchy.
- Indicators that support action.

## What usually goes wrong

Many dashboards look impressive but answer nothing useful. Without organized data and a clear goal, the result is decoration instead of insight.

## My approach

I usually start by understanding which decisions need support, then I structure the data, and only after that do I design the visual layer.`,
    date: "2025-01-28",
    readTime: 12,
    tags: ["Power BI", "Data", "Analytics"],
    author: "Wolkendo Arias",
  },
  {
    slug: "typescript-avancado",
    title: "Advanced TypeScript: Types and Generics",
    description: "Use advanced types and generics to write safer and more maintainable TypeScript.",
    content: `# Advanced TypeScript: Types and Generics

TypeScript improves maintainability when it is used with intention. Advanced typing is not for showing off: it reduces mistakes, clarifies contracts, and makes evolution safer.

## Where generics help

- Reuse functions without losing safety.
- Build utilities for data and forms.
- Model API responses more clearly.

## Useful utility types

- Partial<T> for incremental editing.
- Pick<T, K> to narrow contracts.
- Record<K, T> for predictable state maps.

## A practical warning

If the typing becomes harder to understand than the actual problem, it has probably gone too far. The best TypeScript protects without making the code harder to read.`,
    date: "2025-01-20",
    readTime: 10,
    tags: ["TypeScript", "JavaScript", "Dev"],
    author: "Wolkendo Arias",
  },
];

const frBlogPosts: BlogPostContent[] = [
  {
    slug: "introducao-nextjs",
    title: "Prise en main de Next.js 16",
    description: "Les bases de Next.js pour construire des applications web modernes.",
    content: `# Prise en main de Next.js 16

Next.js est un framework React puissant qui simplifie le développement web moderne. Dans cet article, je résume les points qui comptent vraiment pour démarrer proprement.

## Pourquoi utiliser Next.js ?

- Rendu hybride pour équilibrer performance et expérience utilisateur.
- App Router avec une structure plus claire entre layout, données et pages.
- Routes API et Server Components dans la même application.
- Optimisations natives pour les images, les polices et la navigation.

## Ma logique sur un projet réel

Quand j'utilise Next.js, je ne pense pas seulement au visuel. Je regarde aussi les routes, la stratégie de données, la validation, le déploiement et la maintenance. Cela évite beaucoup de reprise plus tard.

## Premier pas

Si l'objectif est de créer un produit web professionnel, il vaut mieux commencer par l'architecture des pages, les composants partagés et les règles métier avant de se limiter à l'interface initiale.`,
    date: "2025-02-01",
    readTime: 8,
    tags: ["Next.js", "React", "Web Dev"],
    author: "Wolkendo Arias",
  },
  {
    slug: "power-bi-dashboards",
    title: "Créer des dashboards professionnels avec Power BI",
    description: "Guide pratique pour concevoir des dashboards Power BI interactifs et utiles à la décision.",
    content: `# Créer des dashboards professionnels avec Power BI

Power BI devient vraiment utile quand les données brutes se transforment en lecture opérationnelle claire. Le plus important n'est pas le graphique, mais la décision qu'il aide à prendre.

## Les bases d'un bon dashboard

- Une modélisation de données cohérente.
- Des mesures alignées sur le contexte métier.
- Une hiérarchie visuelle claire.
- Des indicateurs qui servent à agir.

## Ce qui se passe souvent mal

Beaucoup de dashboards sont esthétiques mais ne répondent à aucune vraie question. Sans données bien structurées et sans objectif clair, on obtient une vitrine, pas un outil.

## Mon approche

Je commence généralement par comprendre quelles décisions doivent être soutenues, ensuite j'organise les données, puis seulement après je travaille la couche visuelle.`,
    date: "2025-01-28",
    readTime: 12,
    tags: ["Power BI", "Data", "Analytics"],
    author: "Wolkendo Arias",
  },
  {
    slug: "typescript-avancado",
    title: "TypeScript avancé : types et generics",
    description: "Maîtrisez les types avancés et les generics pour écrire un TypeScript plus fiable.",
    content: `# TypeScript avancé : types et generics

TypeScript améliore fortement la maintenance quand il est utilisé avec intention. Les types avancés ne servent pas à impressionner : ils réduisent les erreurs, clarifient les contrats et facilitent l'évolution.

## Où les generics sont utiles

- Réutiliser des fonctions sans perdre en sécurité.
- Créer des utilitaires pour les données et les formulaires.
- Mieux modéliser les réponses d'API.

## Types utilitaires utiles

- Partial<T> pour l'édition incrémentale.
- Pick<T, K> pour restreindre un contrat.
- Record<K, T> pour des mappages d'état prévisibles.

## Point d'attention

Si la typage devient plus difficile à lire que le problème lui-même, c'est probablement trop complexe. Le meilleur TypeScript protège sans alourdir la lecture.`,
    date: "2025-01-20",
    readTime: 10,
    tags: ["TypeScript", "JavaScript", "Dev"],
    author: "Wolkendo Arias",
  },
];

const dictionaries: Record<Locale, SiteDictionary> = {
  pt: {
    navbar: {
      links: [
        { href: "#inicio", label: "Início" },
        { href: "#sobre", label: "Sobre" },
        { href: "#experiencia", label: "Experiência" },
        { href: "#processo", label: "Processo" },
        { href: "#projeto", label: "Projetos" },
      ],
      cvLabel: "CV",
      mobileCvLabel: "Ver CV",
      contactCta: "Vamos conversar",
      localeSwitcherLabel: "Idioma",
    },
    hero: {
      eyebrow: "Desenvolvimento web, automação e integração",
      title: "Desenvolvedor Full Stack para tirar projetos do",
      titleHighlight: "conceito à produção",
      description:
        "Desenvolvo aplicações web completas, unindo interfaces modernas a uma lógica de negócio bem estruturada e integração com banco de dados. Meu foco está em qualidade, performance e na entrega de soluções realmente utilizáveis.",
      ctaPrimary: "Falar sobre um projeto",
      ctaSecondary: "Ver estudos de caso",
      resumeLabel: "Abrir currículo",
      proofItems: [
        { label: "Stack principal", value: "Next.js, Node.js, TypeScript e SQL" },
        { label: "Foco de entrega", value: "Interfaces, APIs, integrações e automação" },
        { label: "Qualidade", value: "Validação, testes e deploy com atenção a regressão" },
      ],
      badges: [
        "PT · FR · CR · EN",
        "Computação + dados + design aplicado",
        "Disponível para projetos web e automação",
      ],
      socialLinkedIn: "LinkedIn",
      socialGitHub: "GitHub",
      profileAlt: "Foto de perfil de Wolkendo Arias",
    },
    about: {
      heading: "Muito prazer, sou Wolkendo Arias.",
      highlight: "sou Wolkendo Arias",
      description: [
        "Atuo construindo soluções digitais com visão de produto e execução técnica. Meu trabalho conecta interface, regras de negócio, banco de dados, integrações e qualidade de software para que o projeto funcione de verdade em produção.",
        "Além do desenvolvimento web, também trago repertório em Power BI, automação de processos e organização de fluxos operacionais. Isso me ajuda a pensar não apenas na tela, mas no problema completo que o sistema precisa resolver.",
      ],
      pillars: [
        {
          title: "Aplicações web ponta a ponta",
          description: "Interfaces, APIs, integrações e persistência trabalhando juntas com foco em entrega real.",
        },
        {
          title: "Automação de processos",
          description: "Redução de tarefas manuais com fluxos, validações e ferramentas low-code quando fazem sentido.",
        },
        {
          title: "Dados e visualização",
          description: "Dashboards, análise e modelagem para transformar informação em decisão mais rápida.",
        },
        {
          title: "Comunicação multicultural",
          description: "Experiência em ambientes colaborativos com fluência em crioulo, francês e português.",
        },
      ],
    },
    experience: {
      heading: "Minha Trajetória",
      highlight: "Trajetória",
      description: "Experiências e formação que construíram minha carreira em tecnologia",
      items: [
        {
          title: "Desenvolvedor Full Stack",
          company: "Prime Secure",
          period: "Novembro 2025 - Presente",
          description:
            "Desenvolvimento de aplicações web full stack com React, Next.js e Node.js, incluindo integração com APIs, banco de dados e validações de negócio.",
          skills: ["React", "Next.js", "TypeScript", "Node.js", "SQL"],
        },
        {
          title: "Analista de Suporte de TI",
          company: "DXC Technology",
          period: "Setembro 2025 - Novembro 2025",
          description:
            "Onboarding e offboarding de colaboradores, suporte técnico de hardware e software, manutenção preventiva de equipamentos e infraestrutura de TI.",
          skills: ["Suporte", "Infraestrutura", "Processos", "Atendimento"],
        },
        {
          title: "Estagiário de TI",
          company: "Tribunal de Justiça de São Paulo",
          period: "Setembro 2024 - Setembro 2025",
          description:
            "Atuação em automação e organização de fluxos com Bizagi, Excel, Power BI e desenvolvimento low-code com Power Apps e Power Automate.",
          skills: ["Power BI", "Bizagi", "SharePoint", "Excel", "Power Platform"],
        },
        {
          title: "Designer Gráfico",
          company: "Behance & Portfólio",
          period: "2022 - Presente",
          description: "Identidade visual, design de interfaces e materiais gráficos para redes sociais.",
          skills: ["Photoshop", "Illustrator", "Figma", "Adobe XD"],
        },
      ],
    },
    howIWork: {
      heading: "Como eu estruturo a entrega",
      highlight: "estruturo a entrega",
      description:
        "Meu diferencial não é só stack. É conseguir organizar a solução do começo ao fim com foco em uso real, clareza técnica e qualidade.",
      workflow: [
        {
          step: "01",
          title: "Entendimento do cenário",
          description: "Eu começo pelo problema real: contexto do negócio, gargalos atuais, fluxo do usuário e objetivo da entrega.",
        },
        {
          step: "02",
          title: "Estrutura da solução",
          description: "Defino a base técnica com foco em clareza: interface, API, dados, integrações e o caminho mais pragmático para entregar.",
        },
        {
          step: "03",
          title: "Implementação com validação",
          description: "Desenvolvo a solução com atenção a consistência, regras de negócio, testes e prevenção de regressões.",
        },
        {
          step: "04",
          title: "Entrega pronta para uso",
          description: "Fecho com ajuste fino, revisão da experiência, build e preparo da aplicação para uso real e evolução futura.",
        },
      ],
      asideEyebrow: "O que você encontra aqui",
      asideTitle: "Código, processo e contexto trabalhando juntos.",
      asideDescription:
        "Eu gosto de projetos onde é preciso parar, pensar e entender o problema de verdade. Me preocupo em estruturar bem a solução e entregar algo confiável, que possa evoluir depois sem dor.",
      signals: [
        "Aplicações web responsivas",
        "Integração com APIs e banco de dados",
        "Automação e melhoria de processo",
        "Validação, testes e build no fluxo",
      ],
    },
    projects: {
      heading: "Projetos com contexto e entrega",
      highlight: "contexto e entrega",
      description:
        "Em vez de só listar stack, aqui está o tipo de problema que eu gosto de resolver e o que entrego em cada frente.",
      challengeLabel: "Desafio",
      deliveryLabel: "Entrega",
      viewMoreLabel: "Ver mais",
      items: [
        {
          title: "Sistema Full Stack de cadastro e contato",
          category: "Aplicação web",
          description: "Projeto com front-end em Next.js, API, persistência em banco e fluxo de contato com validação.",
          image: "/web_pro.jpg",
          href: "https://github.com/maestrowoldo",
          tag: "Full Stack",
          tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
          challenge: "Criar uma base confiável para captação de contatos e apresentação profissional em produção.",
          delivery: "Interface responsiva, rota de API, validação com Zod, persistência com Prisma e pipeline com lint, testes e build.",
        },
        {
          title: "Aplicativo interno de controle de ponto",
          category: "Automação de processo",
          description: "Solução interna low-code para registro operacional, organização de fluxo e automações.",
          image: "/designer.avif",
          href: "https://github.com/maestrowoldo/Aplicativo---Ponto---Power-Apps",
          tag: "Power Platform",
          tech: ["Power Apps", "Power Automate", "SharePoint", "Processos"],
          challenge: "Reduzir esforço manual e estruturar um fluxo mais claro para controle de ponto e acompanhamento.",
          delivery: "Aplicativo interno com registro padronizado, integrações com Microsoft 365 e automações para o processo.",
        },
        {
          title: "Dashboards e análise operacional em Power BI",
          category: "Dados e visualização",
          description: "Painéis para acompanhar indicadores e apoiar tomada de decisão com melhor leitura dos dados.",
          image: "/BI.jpg",
          href: "/curriculum",
          tag: "Power BI",
          tech: ["Power BI", "SQL", "DAX"],
          challenge: "Transformar dados operacionais em leitura visual útil para acompanhamento e priorização.",
          delivery: "Modelagem, revisão de dados e dashboards voltados a acompanhamento de indicadores e contexto de negócio.",
        },
      ],
    },
    blog: {
      title: "Blog",
      metadataTitle: "Blog - Wolkendo Arias",
      metadataDescription: "Artigos sobre desenvolvimento web, análise de dados e tecnologia.",
      previewTitle: "Últimos",
      previewTitleAccent: "Artigos",
      previewDescription: "Insights sobre desenvolvimento, dados e tecnologia",
      previewReadLabel: "Ler artigo",
      viewAllLabel: "Ver todos os artigos",
      backLabel: "Voltar",
      byLabel: "Por",
      readTimeLabel: "min de leitura",
      emptyTitle: "Artigo não encontrado",
      posts: ptBlogPosts,
    },
    techMarquee: {
      title: "Tecnologia",
      accent: "& Ferramenta",
    },
    contactSection: {
      heading: "Vamos transformar sua necessidade em entrega concreta",
      highlight: "entrega concreta",
      description:
        "Se você precisa de uma aplicação web, melhoria de processo, integração entre sistemas ou uma solução mais organizada para operação, me mande o contexto. Eu respondo com objetividade.",
      infoCards: [
        {
          title: "O que você pode me enviar",
          description: "Ideia do projeto, prazo, stack atual, gargalo técnico ou necessidade do negócio.",
        },
        {
          title: "Como eu costumo atuar",
          description: "Diagnóstico, implementação, validação e ajuste fino para a entrega ficar utilizável de verdade.",
        },
      ],
      form: {
        nameLabel: "Nome completo",
        namePlaceholder: "Seu nome",
        emailLabel: "E-mail",
        emailPlaceholder: "seu@email.com",
        cellphoneLabel: "Celular (opcional)",
        cellphonePlaceholder: "(11) 99999-9999",
        messageLabel: "Mensagem",
        messagePlaceholder: "Conte o que você precisa resolver, o contexto atual e o que espera como entrega.",
        submitIdle: "Enviar mensagem",
        submitLoading: "Enviando...",
        successMessage: "Mensagem enviada com sucesso! Obrigado por entrar em contato.",
        errorMessage: "Erro ao enviar. Tente novamente em alguns instantes.",
        validation: {
          minName: "Nome deve ter pelo menos 3 caracteres",
          maxName: "Nome deve ter no máximo 100 caracteres",
          invalidEmail: "Forneça um email válido",
          maxEmail: "Email deve ter no máximo 100 caracteres",
          invalidCellphone: "Celular inválido",
          minMessage: "Mensagem deve ter pelo menos 10 caracteres",
          maxMessage: "Mensagem deve ter no máximo 2000 caracteres",
        },
      },
    },
    contactPage: {
      title: "Fale comigo",
      subtitle: "Escolha o idioma, descreva o contexto e eu respondo com objetividade.",
      metadataTitle: "Contato - Wolkendo Arias",
      metadataDescription: "Entre em contato com Wolkendo Arias para projetos web, automação e dados.",
    },
    footer: {
      copyright: "Woldo Pro · Wolkendo Arias.",
    },
    assistant: {
      buttonLabel: "Vamos conversar",
      headerTitle: "Assistente Wolkendo",
      onlineLabel: "Online",
      inputPlaceholder: "Digite sua mensagem...",
      typingLabel: "Digitando...",
      greeting: "Olá! Sou o assistente virtual do Wolkendo. Posso te ajudar com informações sobre projetos, experiência ou contato.",
      defaultResponse: "Posso te ajudar com projetos, tecnologias, experiência ou formas de contato.",
      suggestionQuestions: [
        "Quais tecnologias você domina?",
        "Quais projetos você já fez?",
        "Você está disponível para trabalho?",
      ],
      ctaLabel: "Fale diretamente comigo",
      responses: [
        {
          keywords: ["oi", "olá", "ola"],
          response: [
            "Olá! Sou o assistente virtual do Wolkendo. Como posso ajudar?",
            "Oi. Posso te contar sobre projetos, experiência ou como entrar em contato.",
          ],
        },
        {
          keywords: ["quem é você", "quem você é"],
          response: "Sou o assistente virtual do Wolkendo Arias, desenvolvedor full stack com experiência em aplicações web, dados e automação.",
        },
        {
          keywords: ["o que você faz", "seu trabalho"],
          response: "O Wolkendo atua no desenvolvimento de aplicações web modernas, do código ao deploy, com foco em qualidade, automação e soluções escaláveis.",
        },
        {
          keywords: ["tecnologias", "stack", "ferramentas"],
          response: "Ele trabalha com React, Next.js, TypeScript, Node.js, PostgreSQL, Python, Power BI e ferramentas de automação.",
        },
        {
          keywords: ["projetos"],
          response: "Entre os projetos estão aplicações full stack, dashboards em Power BI e automações internas. Você pode ver detalhes na seção de projetos.",
        },
        {
          keywords: ["experiência", "trabalho"],
          response: "Atualmente, Wolkendo atua como Desenvolvedor Full Stack na Prime Secure, com experiência anterior em TI, dados e automação.",
        },
        {
          keywords: ["contato", "falar", "email"],
          response: "Você pode entrar em contato pelo formulário do site, LinkedIn ou GitHub. É só clicar em 'Vamos conversar'.",
        },
        {
          keywords: ["disponível", "contratar", "freelance"],
          response: "Sim. Wolkendo está disponível para novos projetos e oportunidades.",
        },
      ],
    },
    curriculum: {
      metadataTitle: "Currículo - Wolkendo Arias",
      metadataDescription: "Currículo profissional de Wolkendo Arias em desenvolvimento web, dados e automação.",
      backLabel: "Voltar ao portfólio",
      downloadLabel: "Baixar PDF",
      generatingLabel: "Gerando...",
      downloadFileName: "Curriculo-Wolkendo-Arias.pdf",
      subtitle: "Desenvolvedor Web Full Stack",
      headerRole: "Desenvolvedor Web Full Stack",
      profileSummary:
        "Desenvolvedor Full Stack com experiência no desenvolvimento de aplicações web do código ao deploy, integração de sistemas e automação de processos. Atuo principalmente com Node.js, JavaScript e TypeScript, criando aplicações robustas e escaláveis. Possuo vivência complementar em análise de dados e Business Intelligence, além de modelagem de processos e soluções low-code.",
      contact: {
        location: "Perus, SP",
      },
      sections: {
        professionalSummary: "Resumo Profissional",
        experience: "Experiência Profissional",
        projects: "Projetos Principais",
        technicalSkills: "Habilidades Técnicas",
        education: "Formação Acadêmica",
        certifications: "Certificações & Cursos",
        languages: "Idiomas",
      },
      experience: [
        {
          role: "Desenvolvedor Full Stack",
          company: "Prime Secure",
          period: "Novembro 2025 - Presente",
          descriptions: [
            "Desenvolvimento de aplicações web full stack utilizando React, Next.js e Node.js.",
            "Criação e consumo de APIs REST, integração com bancos de dados relacionais.",
            "Implementação de autenticação, regras de negócio e validações.",
            "Criação de testes automatizados com Vitest para validação funcional e regressões.",
            "Apoio em QA, identificação de falhas e validação funcional das aplicações.",
            "Atuação no ciclo completo: desenvolvimento, versionamento, testes e deploy.",
          ],
        },
        {
          role: "Analista de Suporte Técnico",
          company: "DXC Technology",
          period: "Setembro 2025 - Novembro 2025",
          descriptions: [
            "Suporte técnico a usuários em onboarding e offboarding.",
            "Instalação e configuração de softwares e ambientes.",
            "Apoio à infraestrutura e manutenção preventiva.",
          ],
        },
        {
          role: "Estagiário em Ciência da Computação",
          company: "Tribunal de Justiça de São Paulo",
          period: "Setembro 2024 - Setembro 2025",
          descriptions: [
            "Mapeamento e documentação de processos utilizando Bizagi.",
            "Desenvolvimento de dashboards interativos no Power BI.",
            "Estruturação e modelagem de dados para decisões estratégicas.",
            "Desenvolvimento low-code de aplicativo de controle de ponto com Power Apps e Power Automate.",
          ],
        },
      ],
      projects: [
        {
          title: "Sistema Full Stack de Cadastro Web",
          description: "Aplicação web desenvolvida do zero até o deploy, com autenticação de usuários, API REST, modelagem relacional em PostgreSQL e versionamento com Git.",
          technologies: ["Node.js", "Express", "PostgreSQL", "JavaScript", "HTML", "CSS", "AWS EC2", "GitHub"],
        },
        {
          title: "Aplicativo Interno de Controle de Ponto",
          description: "Aplicativo low-code com Microsoft Power Apps para registro de ponto e gerenciamento de estagiários, integrado ao SharePoint e Power Automate.",
          technologies: ["Power Apps", "Power Automate", "SharePoint", "Microsoft 365"],
        },
        {
          title: "Portfólio Pessoal",
          description: "Projeto desenvolvido para apresentar habilidades e experiências em desenvolvimento web, design gráfico e inteligência de dados.",
          technologies: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"],
        },
      ],
      skills: [
        { area: "Back-End", skills: "Python, Node.js, Java, JavaScript" },
        { area: "Front-End", skills: "HTML5, CSS3, JavaScript, React, Next.js" },
        { area: "Banco de Dados", skills: "SQL Server, MySQL, PostgreSQL (modelagem relacional)" },
        { area: "Infraestrutura & Deploy", skills: "AWS (Lambda, EC2), Git, GitHub" },
        { area: "Business Intelligence", skills: "Power BI, Power Platform, Bizagi" },
        { area: "Ferramentas & Automação", skills: "Power Apps, Power Automate, n8n, Notion" },
      ],
      education: [
        {
          course: "Bacharelado em Ciência da Computação",
          institution: "Universidade Cruzeiro do Sul",
          period: "2022 - Presente (Previsão: Dezembro 2025)",
        },
        {
          course: "Tecnólogo em Telecomunicações",
          institution: "Centre Professionnel Notre Guadalupe",
          period: "2015 - 2017",
        },
      ],
      certifications: [
        "Python para Análise de Dados - DSA (Andamento)",
        "Desenvolvedor Web Back-End - Senac (2025)",
        "Power BI - Senac (2025)",
        "Introdução ao Mapeamento de Processo - Bizagi - TJSP (2025)",
        "Introduction to Cybersecurity & Endpoint Security - Senai (2024)",
        "CCNA: Introduction to Networks - Cisco (2024)",
        "Google: Inteligência Artificial e Produtividade - Santander Open Academy (2024)",
        "Automação com n8n - Santander Open Academy (2026)",
      ],
      languages: [
        { language: "Francês e Crioulo", level: "Nativo" },
        { language: "Português", level: "Fluente" },
        { language: "Inglês", level: "Intermediário" },
      ],
    },
    homeMeta: {
      title: "Wolkendo Arias - Full Stack Developer & Data Analyst",
      description: "Portfólio profissional de Wolkendo Arias com foco em desenvolvimento web, automação, dados e entrega de soluções digitais.",
      keywords: ["desenvolvedor web", "full stack", "power bi", "análise de dados", "next.js", "typescript", "node.js"],
    },
  },
  en: {
    navbar: {
      links: [
        { href: "#inicio", label: "Home" },
        { href: "#sobre", label: "About" },
        { href: "#experiencia", label: "Experience" },
        { href: "#processo", label: "Process" },
        { href: "#projeto", label: "Projects" },
      ],
      cvLabel: "Resume",
      mobileCvLabel: "View resume",
      contactCta: "Let's talk",
      localeSwitcherLabel: "Language",
    },
    hero: {
      eyebrow: "Web development, automation, and integration",
      title: "Full Stack Developer turning projects from",
      titleHighlight: "concept into production",
      description:
        "I build complete web applications by combining modern interfaces, solid business logic, and database integration. My focus is quality, performance, and solutions that are truly usable in real operations.",
      ctaPrimary: "Discuss a project",
      ctaSecondary: "See case studies",
      resumeLabel: "Open resume",
      proofItems: [
        { label: "Core stack", value: "Next.js, Node.js, TypeScript, and SQL" },
        { label: "Delivery focus", value: "Interfaces, APIs, integrations, and automation" },
        { label: "Quality", value: "Validation, testing, and deploys with regression awareness" },
      ],
      badges: [
        "PT · FR · CR · EN",
        "Computing + data + applied design",
        "Available for web and automation projects",
      ],
      socialLinkedIn: "LinkedIn",
      socialGitHub: "GitHub",
      profileAlt: "Profile photo of Wolkendo Arias",
    },
    about: {
      heading: "Nice to meet you, I'm Wolkendo Arias.",
      highlight: "I'm Wolkendo Arias",
      description: [
        "I build digital solutions with product awareness and technical execution. My work connects interface, business rules, data, integrations, and software quality so the project actually works in production.",
        "Beyond web development, I also bring experience in Power BI, process automation, and operational flow design. That helps me think beyond the screen and address the full problem the system needs to solve.",
      ],
      pillars: [
        {
          title: "End-to-end web applications",
          description: "Interfaces, APIs, integrations, and persistence working together with a delivery mindset.",
        },
        {
          title: "Process automation",
          description: "Reducing manual work with flows, validation, and low-code tools when they genuinely help.",
        },
        {
          title: "Data and visualization",
          description: "Dashboards, analysis, and modeling that turn information into faster decisions.",
        },
        {
          title: "Multicultural communication",
          description: "Experience in collaborative environments with fluency in Creole, French, and Portuguese.",
        },
      ],
    },
    experience: {
      heading: "My Career Path",
      highlight: "Career Path",
      description: "Experience and training that shaped my work in technology",
      items: [
        {
          title: "Full Stack Developer",
          company: "Prime Secure",
          period: "November 2025 - Present",
          description:
            "Building full stack web applications with React, Next.js, and Node.js, including API integration, databases, and business validation.",
          skills: ["React", "Next.js", "TypeScript", "Node.js", "SQL"],
        },
        {
          title: "IT Support Analyst",
          company: "DXC Technology",
          period: "September 2025 - November 2025",
          description:
            "Handled onboarding and offboarding, software and hardware support, and preventive maintenance for devices and IT infrastructure.",
          skills: ["Support", "Infrastructure", "Operations", "Service"],
        },
        {
          title: "IT Intern",
          company: "São Paulo Court of Justice",
          period: "September 2024 - September 2025",
          description:
            "Worked on automation and process organization with Bizagi, Excel, Power BI, and low-code delivery with Power Apps and Power Automate.",
          skills: ["Power BI", "Bizagi", "SharePoint", "Excel", "Power Platform"],
        },
        {
          title: "Graphic Designer",
          company: "Behance & Portfolio",
          period: "2022 - Present",
          description: "Visual identity, interface design, and graphic assets for digital channels.",
          skills: ["Photoshop", "Illustrator", "Figma", "Adobe XD"],
        },
      ],
    },
    howIWork: {
      heading: "How I structure delivery",
      highlight: "structure delivery",
      description:
        "My advantage is not just stack knowledge. It is being able to organize the solution end to end with real-world usage, technical clarity, and quality in mind.",
      workflow: [
        {
          step: "01",
          title: "Understand the real scenario",
          description: "I start from the actual problem: business context, current bottlenecks, user flow, and delivery goals.",
        },
        {
          step: "02",
          title: "Shape the solution",
          description: "I define the technical base with clarity in mind: interface, API, data, integrations, and the most pragmatic path to deliver.",
        },
        {
          step: "03",
          title: "Implement with validation",
          description: "I build with attention to consistency, business rules, testing, and regression prevention.",
        },
        {
          step: "04",
          title: "Deliver ready for use",
          description: "I close with refinements, experience review, build validation, and preparation for real usage and future evolution.",
        },
      ],
      asideEyebrow: "What you find here",
      asideTitle: "Code, process, and context working together.",
      asideDescription:
        "I like projects that require pausing, thinking, and understanding the actual problem. I care about structuring the solution well and delivering something reliable that can evolve without pain.",
      signals: [
        "Responsive web applications",
        "API and database integration",
        "Automation and process improvement",
        "Validation, testing, and build discipline",
      ],
    },
    projects: {
      heading: "Projects with context and delivery",
      highlight: "context and delivery",
      description:
        "Instead of only listing stack, this section shows the kind of problems I like to solve and what I deliver in each scenario.",
      challengeLabel: "Challenge",
      deliveryLabel: "Delivery",
      viewMoreLabel: "View more",
      items: [
        {
          title: "Full stack contact and registration platform",
          category: "Web application",
          description: "Project with a Next.js front end, API layer, database persistence, and a validated contact flow.",
          image: "/web_pro.jpg",
          href: "https://github.com/maestrowoldo",
          tag: "Full Stack",
          tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
          challenge: "Create a reliable production-ready base for lead capture and professional presentation.",
          delivery: "Responsive interface, API route, Zod validation, Prisma persistence, and a lint-test-build workflow.",
        },
        {
          title: "Internal time-tracking application",
          category: "Process automation",
          description: "Internal low-code solution for operational records, clearer workflows, and automation.",
          image: "/designer.avif",
          href: "https://github.com/maestrowoldo/Aplicativo---Ponto---Power-Apps",
          tag: "Power Platform",
          tech: ["Power Apps", "Power Automate", "SharePoint", "Processes"],
          challenge: "Reduce manual effort and organize a clearer flow for time tracking and follow-up.",
          delivery: "Internal application with standardized records, Microsoft 365 integrations, and automation around the process.",
        },
        {
          title: "Operational dashboards and analysis in Power BI",
          category: "Data and visualization",
          description: "Dashboards to monitor indicators and support decisions with clearer data reading.",
          image: "/BI.jpg",
          href: "/curriculum",
          tag: "Power BI",
          tech: ["Power BI", "SQL", "DAX"],
          challenge: "Turn operational data into useful visual insight for follow-up and prioritization.",
          delivery: "Data modeling, data review, and dashboards designed for indicators and business context.",
        },
      ],
    },
    blog: {
      title: "Blog",
      metadataTitle: "Blog - Wolkendo Arias",
      metadataDescription: "Articles about web development, data, and technology.",
      previewTitle: "Latest",
      previewTitleAccent: "Articles",
      previewDescription: "Insights on development, data, and technology",
      previewReadLabel: "Read article",
      viewAllLabel: "View all articles",
      backLabel: "Back",
      byLabel: "By",
      readTimeLabel: "min read",
      emptyTitle: "Article not found",
      posts: enBlogPosts,
    },
    techMarquee: {
      title: "Technology",
      accent: "& Tools",
    },
    contactSection: {
      heading: "Let's turn your need into a concrete delivery",
      highlight: "concrete delivery",
      description:
        "If you need a web application, process improvement, system integration, or a more organized operational solution, send me the context. I reply directly and objectively.",
      infoCards: [
        {
          title: "What you can send me",
          description: "Project idea, timeline, current stack, technical bottleneck, or business need.",
        },
        {
          title: "How I usually work",
          description: "Diagnosis, implementation, validation, and refinement so the final delivery is actually usable.",
        },
      ],
      form: {
        nameLabel: "Full name",
        namePlaceholder: "Your name",
        emailLabel: "Email",
        emailPlaceholder: "your@email.com",
        cellphoneLabel: "Phone (optional)",
        cellphonePlaceholder: "(11) 99999-9999",
        messageLabel: "Message",
        messagePlaceholder: "Tell me what you need to solve, the current context, and what you expect as a delivery.",
        submitIdle: "Send message",
        submitLoading: "Sending...",
        successMessage: "Message sent successfully. Thank you for reaching out.",
        errorMessage: "Could not send your message. Please try again in a moment.",
        validation: {
          minName: "Name must have at least 3 characters",
          maxName: "Name must have at most 100 characters",
          invalidEmail: "Provide a valid email address",
          maxEmail: "Email must have at most 100 characters",
          invalidCellphone: "Invalid phone number",
          minMessage: "Message must have at least 10 characters",
          maxMessage: "Message must have at most 2000 characters",
        },
      },
    },
    contactPage: {
      title: "Contact me",
      subtitle: "Choose your language, describe the context, and I will reply directly.",
      metadataTitle: "Contact - Wolkendo Arias",
      metadataDescription: "Get in touch with Wolkendo Arias for web, automation, and data projects.",
    },
    footer: {
      copyright: "Woldo Pro · Wolkendo Arias.",
    },
    assistant: {
      buttonLabel: "Let's talk",
      headerTitle: "Wolkendo Assistant",
      onlineLabel: "Online",
      inputPlaceholder: "Type your message...",
      typingLabel: "Typing...",
      greeting: "Hello. I'm Wolkendo's virtual assistant. I can help with information about projects, experience, or contact.",
      defaultResponse: "I can help with projects, technologies, experience, or ways to get in touch.",
      suggestionQuestions: [
        "Which technologies do you work with?",
        "What projects have you built?",
        "Are you available for work?",
      ],
      ctaLabel: "Talk to me directly",
      responses: [
        {
          keywords: ["hello", "hi", "hey"],
          response: [
            "Hello. I'm Wolkendo's virtual assistant. How can I help?",
            "Hi. I can tell you about projects, experience, or how to get in touch.",
          ],
        },
        {
          keywords: ["who are you", "about you"],
          response: "I'm Wolkendo Arias's virtual assistant, representing a full stack developer with experience in web applications, data, and automation.",
        },
        {
          keywords: ["what do you do", "your work"],
          response: "Wolkendo builds modern web applications from code to deployment, with focus on quality, automation, and scalable delivery.",
        },
        {
          keywords: ["technologies", "stack", "tools"],
          response: "He works with React, Next.js, TypeScript, Node.js, PostgreSQL, Python, Power BI, and automation tools.",
        },
        {
          keywords: ["projects"],
          response: "Projects include full stack applications, Power BI dashboards, and internal automation flows. You can see details in the projects section.",
        },
        {
          keywords: ["experience", "career"],
          response: "Wolkendo currently works as a Full Stack Developer at Prime Secure and also has background in IT support, data, and automation.",
        },
        {
          keywords: ["contact", "email", "talk"],
          response: "You can reach out using the site form, LinkedIn, or GitHub. Just click 'Let's talk'.",
        },
        {
          keywords: ["available", "hire", "freelance"],
          response: "Yes. Wolkendo is available for new projects and opportunities.",
        },
      ],
    },
    curriculum: {
      metadataTitle: "Resume - Wolkendo Arias",
      metadataDescription: "Professional resume of Wolkendo Arias focused on web development, data, and automation.",
      backLabel: "Back to portfolio",
      downloadLabel: "Download PDF",
      generatingLabel: "Preparing...",
      downloadFileName: "Wolkendo-Arias-Resume.pdf",
      subtitle: "Full Stack Web Developer",
      headerRole: "Full Stack Web Developer",
      profileSummary:
        "Full Stack Developer with experience building web applications from code to deployment, integrating systems, and automating processes. I work mainly with Node.js, JavaScript, and TypeScript to deliver robust and scalable applications, with complementary experience in data analysis, business intelligence, process modeling, and low-code solutions.",
      contact: {
        location: "Perus, São Paulo, Brazil",
      },
      sections: {
        professionalSummary: "Professional Summary",
        experience: "Professional Experience",
        projects: "Key Projects",
        technicalSkills: "Technical Skills",
        education: "Education",
        certifications: "Certifications & Courses",
        languages: "Languages",
      },
      experience: [
        {
          role: "Full Stack Developer",
          company: "Prime Secure",
          period: "November 2025 - Present",
          descriptions: [
            "Built full stack web applications with React, Next.js, and Node.js.",
            "Created and consumed REST APIs, integrating relational databases.",
            "Implemented authentication, business rules, and validation.",
            "Wrote automated tests with Vitest for functionality and regression control.",
            "Supported QA activities, issue detection, and functional validation.",
            "Worked across the full cycle: development, version control, testing, and deployment.",
          ],
        },
        {
          role: "Technical Support Analyst",
          company: "DXC Technology",
          period: "September 2025 - November 2025",
          descriptions: [
            "Provided technical support during onboarding and offboarding.",
            "Installed and configured software and work environments.",
            "Supported infrastructure and preventive maintenance.",
          ],
        },
        {
          role: "Computer Science Intern",
          company: "São Paulo Court of Justice",
          period: "September 2024 - September 2025",
          descriptions: [
            "Mapped and documented processes using Bizagi.",
            "Built interactive dashboards in Power BI.",
            "Structured and modeled data for strategic decisions.",
            "Developed a low-code time tracking app with Power Apps and Power Automate.",
          ],
        },
      ],
      projects: [
        {
          title: "Full Stack Web Registration System",
          description: "Web application built from scratch to cloud deployment, including user authentication, REST API, PostgreSQL relational modeling, and Git-based versioning.",
          technologies: ["Node.js", "Express", "PostgreSQL", "JavaScript", "HTML", "CSS", "AWS EC2", "GitHub"],
        },
        {
          title: "Internal Time Tracking Application",
          description: "Low-code application built with Microsoft Power Apps for time records and intern management, integrated with SharePoint and Power Automate.",
          technologies: ["Power Apps", "Power Automate", "SharePoint", "Microsoft 365"],
        },
        {
          title: "Personal Portfolio",
          description: "Project built to present experience in web development, graphic design, and data-driven work with a modern responsive interface.",
          technologies: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"],
        },
      ],
      skills: [
        { area: "Back-End", skills: "Python, Node.js, Java, JavaScript" },
        { area: "Front-End", skills: "HTML5, CSS3, JavaScript, React, Next.js" },
        { area: "Databases", skills: "SQL Server, MySQL, PostgreSQL (relational modeling)" },
        { area: "Infrastructure & Deploy", skills: "AWS (Lambda, EC2), Git, GitHub" },
        { area: "Business Intelligence", skills: "Power BI, Power Platform, Bizagi" },
        { area: "Tools & Automation", skills: "Power Apps, Power Automate, n8n, Notion" },
      ],
      education: [
        {
          course: "Bachelor's Degree in Computer Science",
          institution: "Universidade Cruzeiro do Sul",
          period: "2022 - Present (expected completion: December 2025)",
        },
        {
          course: "Associate Degree in Telecommunications",
          institution: "Centre Professionnel Notre Guadalupe",
          period: "2015 - 2017",
        },
      ],
      certifications: [
        "Python for Data Analysis - DSA (In progress)",
        "Back-End Web Developer - Senac (2025)",
        "Power BI - Senac (2025)",
        "Introduction to Process Mapping - Bizagi - TJSP (2025)",
        "Introduction to Cybersecurity & Endpoint Security - Senai (2024)",
        "CCNA: Introduction to Networks - Cisco (2024)",
        "Google: Artificial Intelligence and Productivity - Santander Open Academy (2024)",
        "Automation with n8n - Santander Open Academy (2026)",
      ],
      languages: [
        { language: "French and Creole", level: "Native" },
        { language: "Portuguese", level: "Fluent" },
        { language: "English", level: "Intermediate" },
      ],
    },
    homeMeta: {
      title: "Wolkendo Arias - Full Stack Developer & Data Analyst",
      description: "Professional portfolio of Wolkendo Arias focused on web development, automation, data, and practical digital delivery.",
      keywords: ["web developer", "full stack", "power bi", "data analysis", "next.js", "typescript", "node.js"],
    },
  },
  fr: {
    navbar: {
      links: [
        { href: "#inicio", label: "Accueil" },
        { href: "#sobre", label: "À propos" },
        { href: "#experiencia", label: "Expérience" },
        { href: "#processo", label: "Méthode" },
        { href: "#projeto", label: "Projets" },
      ],
      cvLabel: "CV",
      mobileCvLabel: "Voir le CV",
      contactCta: "Parlons",
      localeSwitcherLabel: "Langue",
    },
    hero: {
      eyebrow: "Développement web, automatisation et intégration",
      title: "Développeur Full Stack pour faire passer un projet du",
      titleHighlight: "concept à la production",
      description:
        "Je développe des applications web complètes en combinant interfaces modernes, logique métier structurée et intégration base de données. Mon objectif est la qualité, la performance et des solutions réellement utilisables.",
      ctaPrimary: "Parler d'un projet",
      ctaSecondary: "Voir les cas",
      resumeLabel: "Ouvrir le CV",
      proofItems: [
        { label: "Stack principal", value: "Next.js, Node.js, TypeScript et SQL" },
        { label: "Focus livraison", value: "Interfaces, API, intégrations et automatisation" },
        { label: "Qualité", value: "Validation, tests et déploiement avec attention aux régressions" },
      ],
      badges: [
        "PT · FR · CR · EN",
        "Informatique + données + design appliqué",
        "Disponible pour projets web et automatisation",
      ],
      socialLinkedIn: "LinkedIn",
      socialGitHub: "GitHub",
      profileAlt: "Photo de profil de Wolkendo Arias",
    },
    about: {
      heading: "Enchanté, je suis Wolkendo Arias.",
      highlight: "je suis Wolkendo Arias",
      description: [
        "Je construis des solutions digitales avec une vision produit et une exécution technique solide. Mon travail relie interface, règles métier, données, intégrations et qualité logicielle pour que le projet fonctionne réellement en production.",
        "Au-delà du développement web, j'apporte aussi une expérience en Power BI, automatisation de processus et organisation de flux opérationnels. Cela me permet de penser au problème dans son ensemble, pas seulement à l'écran.",
      ],
      pillars: [
        {
          title: "Applications web de bout en bout",
          description: "Interfaces, API, intégrations et persistance qui travaillent ensemble avec un objectif de livraison concret.",
        },
        {
          title: "Automatisation de processus",
          description: "Réduction des tâches manuelles avec des flux, validations et outils low-code quand ils sont pertinents.",
        },
        {
          title: "Données et visualisation",
          description: "Dashboards, analyse et modélisation pour transformer l'information en décision plus rapide.",
        },
        {
          title: "Communication multiculturelle",
          description: "Expérience d'environnements collaboratifs avec maîtrise du créole, du français et du portugais.",
        },
      ],
    },
    experience: {
      heading: "Mon parcours",
      highlight: "parcours",
      description: "Expériences et formation qui ont construit mon parcours en technologie",
      items: [
        {
          title: "Développeur Full Stack",
          company: "Prime Secure",
          period: "Novembre 2025 - Aujourd'hui",
          description:
            "Développement d'applications web full stack avec React, Next.js et Node.js, incluant intégration API, base de données et validation métier.",
          skills: ["React", "Next.js", "TypeScript", "Node.js", "SQL"],
        },
        {
          title: "Analyste support IT",
          company: "DXC Technology",
          period: "Septembre 2025 - Novembre 2025",
          description:
            "Gestion de l'onboarding et de l'offboarding, support matériel et logiciel, et maintenance préventive des équipements et de l'infrastructure IT.",
          skills: ["Support", "Infrastructure", "Opérations", "Service"],
        },
        {
          title: "Stagiaire IT",
          company: "Tribunal de Justice de São Paulo",
          period: "Septembre 2024 - Septembre 2025",
          description:
            "Participation à l'automatisation et à l'organisation de processus avec Bizagi, Excel, Power BI et solutions low-code via Power Apps et Power Automate.",
          skills: ["Power BI", "Bizagi", "SharePoint", "Excel", "Power Platform"],
        },
        {
          title: "Designer graphique",
          company: "Behance & Portfolio",
          period: "2022 - Aujourd'hui",
          description: "Identité visuelle, design d'interface et supports graphiques pour les réseaux et produits digitaux.",
          skills: ["Photoshop", "Illustrator", "Figma", "Adobe XD"],
        },
      ],
    },
    howIWork: {
      heading: "Comment je structure la livraison",
      highlight: "structure la livraison",
      description:
        "Ma différence ne se limite pas à la stack. Elle tient à la capacité d'organiser une solution de bout en bout avec usage réel, clarté technique et qualité.",
      workflow: [
        {
          step: "01",
          title: "Comprendre la situation",
          description: "Je commence par le vrai problème : contexte métier, blocages actuels, flux utilisateur et objectif de la livraison.",
        },
        {
          step: "02",
          title: "Structurer la solution",
          description: "Je définis la base technique avec clarté : interface, API, données, intégrations et chemin le plus pragmatique pour livrer.",
        },
        {
          step: "03",
          title: "Implémenter avec validation",
          description: "Je développe avec attention à la cohérence, aux règles métier, aux tests et à la prévention des régressions.",
        },
        {
          step: "04",
          title: "Livrer prêt à l'usage",
          description: "Je termine avec les ajustements fins, la revue d'expérience, la validation du build et la préparation à l'usage réel.",
        },
      ],
      asideEyebrow: "Ce que vous trouverez ici",
      asideTitle: "Code, processus et contexte qui avancent ensemble.",
      asideDescription:
        "J'aime les projets qui demandent de s'arrêter, réfléchir et comprendre le vrai problème. Je fais attention à bien structurer la solution et à livrer quelque chose de fiable et évolutif.",
      signals: [
        "Applications web responsives",
        "Intégration API et base de données",
        "Automatisation et amélioration de processus",
        "Validation, tests et discipline de build",
      ],
    },
    projects: {
      heading: "Des projets avec contexte et résultat",
      highlight: "contexte et résultat",
      description:
        "Au lieu de simplement lister une stack, cette section montre le type de problème que j'aime résoudre et ce que je livre concrètement.",
      challengeLabel: "Défi",
      deliveryLabel: "Livraison",
      viewMoreLabel: "Voir plus",
      items: [
        {
          title: "Plateforme full stack de contact et d'inscription",
          category: "Application web",
          description: "Projet avec front-end Next.js, couche API, persistance en base et flux de contact validé.",
          image: "/web_pro.jpg",
          href: "https://github.com/maestrowoldo",
          tag: "Full Stack",
          tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
          challenge: "Créer une base fiable prête pour la production afin de capter des contacts et présenter un profil professionnel.",
          delivery: "Interface responsive, route API, validation Zod, persistance Prisma et workflow lint-test-build.",
        },
        {
          title: "Application interne de pointage",
          category: "Automatisation de processus",
          description: "Solution low-code interne pour les enregistrements opérationnels, l'organisation des flux et l'automatisation.",
          image: "/designer.avif",
          href: "https://github.com/maestrowoldo/Aplicativo---Ponto---Power-Apps",
          tag: "Power Platform",
          tech: ["Power Apps", "Power Automate", "SharePoint", "Processus"],
          challenge: "Réduire l'effort manuel et structurer un flux plus clair pour le suivi des heures.",
          delivery: "Application interne avec enregistrement standardisé, intégrations Microsoft 365 et automatisations autour du processus.",
        },
        {
          title: "Dashboards et analyse opérationnelle avec Power BI",
          category: "Données et visualisation",
          description: "Tableaux de bord pour suivre les indicateurs et mieux soutenir les décisions.",
          image: "/BI.jpg",
          href: "/curriculum",
          tag: "Power BI",
          tech: ["Power BI", "SQL", "DAX"],
          challenge: "Transformer des données opérationnelles en lecture visuelle utile pour le suivi et la priorisation.",
          delivery: "Modélisation, revue des données et dashboards pensés pour les indicateurs et le contexte métier.",
        },
      ],
    },
    blog: {
      title: "Blog",
      metadataTitle: "Blog - Wolkendo Arias",
      metadataDescription: "Articles sur le développement web, les données et la technologie.",
      previewTitle: "Derniers",
      previewTitleAccent: "Articles",
      previewDescription: "Réflexions sur le développement, les données et la technologie",
      previewReadLabel: "Lire l'article",
      viewAllLabel: "Voir tous les articles",
      backLabel: "Retour",
      byLabel: "Par",
      readTimeLabel: "min de lecture",
      emptyTitle: "Article introuvable",
      posts: frBlogPosts,
    },
    techMarquee: {
      title: "Technologie",
      accent: "& Outils",
    },
    contactSection: {
      heading: "Transformons votre besoin en livraison concrète",
      highlight: "livraison concrète",
      description:
        "Si vous avez besoin d'une application web, d'une amélioration de processus, d'une intégration entre systèmes ou d'une solution opérationnelle mieux structurée, envoyez-moi le contexte. Je réponds de façon directe.",
      infoCards: [
        {
          title: "Ce que vous pouvez m'envoyer",
          description: "Idée de projet, délai, stack actuelle, blocage technique ou besoin métier.",
        },
        {
          title: "Ma façon de travailler",
          description: "Diagnostic, implémentation, validation et ajustements pour livrer quelque chose de réellement exploitable.",
        },
      ],
      form: {
        nameLabel: "Nom complet",
        namePlaceholder: "Votre nom",
        emailLabel: "E-mail",
        emailPlaceholder: "votre@email.com",
        cellphoneLabel: "Téléphone (optionnel)",
        cellphonePlaceholder: "(11) 99999-9999",
        messageLabel: "Message",
        messagePlaceholder: "Expliquez ce que vous devez résoudre, le contexte actuel et le résultat attendu.",
        submitIdle: "Envoyer le message",
        submitLoading: "Envoi...",
        successMessage: "Message envoyé avec succès. Merci pour votre prise de contact.",
        errorMessage: "Impossible d'envoyer le message. Réessayez dans un instant.",
        validation: {
          minName: "Le nom doit contenir au moins 3 caractères",
          maxName: "Le nom doit contenir au maximum 100 caractères",
          invalidEmail: "Veuillez fournir une adresse e-mail valide",
          maxEmail: "L'e-mail doit contenir au maximum 100 caractères",
          invalidCellphone: "Numéro de téléphone invalide",
          minMessage: "Le message doit contenir au moins 10 caractères",
          maxMessage: "Le message doit contenir au maximum 2000 caractères",
        },
      },
    },
    contactPage: {
      title: "Me contacter",
      subtitle: "Choisissez votre langue, décrivez le contexte et je répondrai avec clarté.",
      metadataTitle: "Contact - Wolkendo Arias",
      metadataDescription: "Contactez Wolkendo Arias pour des projets web, d'automatisation et de données.",
    },
    footer: {
      copyright: "Woldo Pro · Wolkendo Arias.",
    },
    assistant: {
      buttonLabel: "Parlons",
      headerTitle: "Assistant Wolkendo",
      onlineLabel: "En ligne",
      inputPlaceholder: "Tapez votre message...",
      typingLabel: "Écriture...",
      greeting: "Bonjour. Je suis l'assistant virtuel de Wolkendo. Je peux vous aider avec les projets, l'expérience ou le contact.",
      defaultResponse: "Je peux vous aider sur les projets, les technologies, l'expérience ou les moyens de contact.",
      suggestionQuestions: [
        "Quelles technologies maîtrisez-vous ?",
        "Quels projets avez-vous réalisés ?",
        "Êtes-vous disponible pour une mission ?",
      ],
      ctaLabel: "Parler directement avec moi",
      responses: [
        {
          keywords: ["bonjour", "salut", "hello"],
          response: [
            "Bonjour. Je suis l'assistant virtuel de Wolkendo. Comment puis-je aider ?",
            "Salut. Je peux vous parler des projets, de l'expérience ou de la prise de contact.",
          ],
        },
        {
          keywords: ["qui es-tu", "qui êtes-vous"],
          response: "Je suis l'assistant virtuel de Wolkendo Arias, développeur full stack avec expérience en applications web, données et automatisation.",
        },
        {
          keywords: ["que faites-vous", "ton travail", "votre travail"],
          response: "Wolkendo développe des applications web modernes du code jusqu'au déploiement, avec un focus sur la qualité, l'automatisation et les solutions évolutives.",
        },
        {
          keywords: ["technologies", "stack", "outils"],
          response: "Il travaille avec React, Next.js, TypeScript, Node.js, PostgreSQL, Python, Power BI et des outils d'automatisation.",
        },
        {
          keywords: ["projets"],
          response: "Parmi les projets, on trouve des applications full stack, des dashboards Power BI et des automatisations internes. Les détails sont dans la section projets.",
        },
        {
          keywords: ["expérience", "parcours"],
          response: "Wolkendo travaille actuellement comme développeur Full Stack chez Prime Secure et possède aussi une expérience en support IT, données et automatisation.",
        },
        {
          keywords: ["contact", "email", "parler"],
          response: "Vous pouvez le contacter via le formulaire du site, LinkedIn ou GitHub. Il suffit de cliquer sur 'Parlons'.",
        },
        {
          keywords: ["disponible", "recruter", "freelance"],
          response: "Oui. Wolkendo est disponible pour de nouveaux projets et opportunités.",
        },
      ],
    },
    curriculum: {
      metadataTitle: "CV - Wolkendo Arias",
      metadataDescription: "CV professionnel de Wolkendo Arias centré sur le développement web, les données et l'automatisation.",
      backLabel: "Retour au portfolio",
      downloadLabel: "Télécharger le PDF",
      generatingLabel: "Préparation...",
      downloadFileName: "CV-Wolkendo-Arias.pdf",
      subtitle: "Développeur Web Full Stack",
      headerRole: "Développeur Web Full Stack",
      profileSummary:
        "Développeur Full Stack avec expérience dans la création d'applications web du code jusqu'au déploiement, l'intégration de systèmes et l'automatisation de processus. Je travaille principalement avec Node.js, JavaScript et TypeScript, avec une expérience complémentaire en analyse de données, business intelligence, modélisation de processus et solutions low-code.",
      contact: {
        location: "Perus, São Paulo, Brésil",
      },
      sections: {
        professionalSummary: "Résumé professionnel",
        experience: "Expérience professionnelle",
        projects: "Projets principaux",
        technicalSkills: "Compétences techniques",
        education: "Formation",
        certifications: "Certifications & formations",
        languages: "Langues",
      },
      experience: [
        {
          role: "Développeur Full Stack",
          company: "Prime Secure",
          period: "Novembre 2025 - Aujourd'hui",
          descriptions: [
            "Développement d'applications web full stack avec React, Next.js et Node.js.",
            "Création et consommation d'API REST avec intégration à des bases relationnelles.",
            "Implémentation de l'authentification, des règles métier et des validations.",
            "Création de tests automatisés avec Vitest pour la validation fonctionnelle et les régressions.",
            "Support QA, détection d'anomalies et validation fonctionnelle.",
            "Intervention sur le cycle complet : développement, versioning, tests et déploiement.",
          ],
        },
        {
          role: "Analyste support technique",
          company: "DXC Technology",
          period: "Septembre 2025 - Novembre 2025",
          descriptions: [
            "Support technique aux utilisateurs pendant l'onboarding et l'offboarding.",
            "Installation et configuration de logiciels et d'environnements.",
            "Support à l'infrastructure et maintenance préventive.",
          ],
        },
        {
          role: "Stagiaire en informatique",
          company: "Tribunal de Justice de São Paulo",
          period: "Septembre 2024 - Septembre 2025",
          descriptions: [
            "Cartographie et documentation de processus avec Bizagi.",
            "Création de dashboards interactifs sous Power BI.",
            "Structuration et modélisation des données pour des décisions stratégiques.",
            "Développement d'une application low-code de pointage avec Power Apps et Power Automate.",
          ],
        },
      ],
      projects: [
        {
          title: "Système web full stack d'inscription",
          description: "Application web développée de zéro jusqu'au déploiement cloud, avec authentification, API REST, modélisation relationnelle PostgreSQL et versioning Git.",
          technologies: ["Node.js", "Express", "PostgreSQL", "JavaScript", "HTML", "CSS", "AWS EC2", "GitHub"],
        },
        {
          title: "Application interne de pointage",
          description: "Application low-code réalisée avec Microsoft Power Apps pour le suivi des heures et la gestion des stagiaires, intégrée à SharePoint et Power Automate.",
          technologies: ["Power Apps", "Power Automate", "SharePoint", "Microsoft 365"],
        },
        {
          title: "Portfolio personnel",
          description: "Projet conçu pour présenter les compétences et expériences en développement web, design graphique et data.",
          technologies: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"],
        },
      ],
      skills: [
        { area: "Back-End", skills: "Python, Node.js, Java, JavaScript" },
        { area: "Front-End", skills: "HTML5, CSS3, JavaScript, React, Next.js" },
        { area: "Bases de données", skills: "SQL Server, MySQL, PostgreSQL (modélisation relationnelle)" },
        { area: "Infrastructure & déploiement", skills: "AWS (Lambda, EC2), Git, GitHub" },
        { area: "Business Intelligence", skills: "Power BI, Power Platform, Bizagi" },
        { area: "Outils & automatisation", skills: "Power Apps, Power Automate, n8n, Notion" },
      ],
      education: [
        {
          course: "Licence en informatique",
          institution: "Universidade Cruzeiro do Sul",
          period: "2022 - Aujourd'hui (fin prévue : décembre 2025)",
        },
        {
          course: "Diplôme technique en télécommunications",
          institution: "Centre Professionnel Notre Guadalupe",
          period: "2015 - 2017",
        },
      ],
      certifications: [
        "Python pour l'analyse de données - DSA (en cours)",
        "Développeur Web Back-End - Senac (2025)",
        "Power BI - Senac (2025)",
        "Introduction à la cartographie de processus - Bizagi - TJSP (2025)",
        "Introduction to Cybersecurity & Endpoint Security - Senai (2024)",
        "CCNA: Introduction to Networks - Cisco (2024)",
        "Google: Intelligence artificielle et productivité - Santander Open Academy (2024)",
        "Automatisation avec n8n - Santander Open Academy (2026)",
      ],
      languages: [
        { language: "Français et créole", level: "Natif" },
        { language: "Portugais", level: "Courant" },
        { language: "Anglais", level: "Intermédiaire" },
      ],
    },
    homeMeta: {
      title: "Wolkendo Arias - Développeur Full Stack & Data Analyst",
      description: "Portfolio professionnel de Wolkendo Arias orienté développement web, automatisation, données et solutions digitales concrètes.",
      keywords: ["développeur web", "full stack", "power bi", "analyse de données", "next.js", "typescript", "node.js"],
    },
  },
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function getBlogPosts(locale: Locale) {
  return getDictionary(locale).blog.posts;
}

export function getBlogPost(locale: Locale, slug: string) {
  return getBlogPosts(locale).find((post) => post.slug === slug);
}
