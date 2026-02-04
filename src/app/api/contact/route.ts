// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação com Zod
    const validatedData = contactFormSchema.parse(body);
    const { nome, email, celular, mensagem } = validatedData;

    // TODO: Integrar com Prisma quando o banco estiver configurado
    // await prisma.contact.create({
    //   data: { nome, email, celular, mensagem, status: "novo" },
    // });

    // Por enquanto, apenas log
    console.log("📧 Novo contato recebido:", { nome, email, celular });

    // Enviar email (implementação futura com Nodemailer)
    // await sendEmail({
    //   to: email,
    //   subject: "Recebemos sua mensagem",
    //   template: "contact-confirmation",
    //   data: { nome },
    // });

    return NextResponse.json(
      { message: "Mensagem recebida com sucesso! Em breve entro em contato." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erro ao processar contato:", error);

    return NextResponse.json(
      { message: "Erro ao enviar mensagem. Tente novamente." },
      { status: 500 }
    );
  }
}
