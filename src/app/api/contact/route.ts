import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import { sendContactEmail } from "@/lib/email";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação com Zod
    const validatedData = contactFormSchema.parse(body);
    const { nome, email, celular, mensagem } = validatedData;

    // Salvar no banco de dados
    await prisma.contact.create({
      data: { nome, email, celular: celular || null, mensagem, status: "novo" },
    });

    // Enviar email
    console.log("📧 Enviando email para:", email);
    const emailEnviado = await sendContactEmail(nome, email, mensagem);

    if (!emailEnviado) {
      console.warn("⚠️ Email não foi enviado, mas contato foi salvo no banco");
    }

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
