import { NextResponse } from "next/server";

export function GET() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Wolkendo Arias",
    url: "https://wolkendoarias.com",
    image: "https://wolkendoarias.com/perfilgood.jpg",
    description:
      "Desenvolvedor Full Stack, Analista de Dados e especialista em Power BI",
    jobTitle: ["Full Stack Developer", "Data Analyst"],
    email: "contact@wolkendoarias.com",
    sameAs: [
      "https://linkedin.com/in/wolkendo",
      "https://github.com/wolkendo",
      "https://behance.net/wolkendo",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Freelancer",
    },
    knowsLanguage: ["Portuguese", "French", "English", "Creole"],
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "Power BI",
      "SQL",
      "HTML5",
      "CSS3",
    ],
  };

  return NextResponse.json(schema, {
    headers: {
      "Content-Type": "application/ld+json",
    },
  });
}
