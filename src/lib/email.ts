import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendContactEmail(
  nome: string,
  email: string,
  mensagem: string
) {
  try {
    // Email para o usuário
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Recebemos sua mensagem! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Obrigado, ${nome}!</h2>
          <p>Recebemos sua mensagem com sucesso. Vou analisar e entrar em contato em breve.</p>
          <hr style="margin: 20px 0;">
          <p><strong>Sua mensagem:</strong></p>
          <p>${mensagem.replace(/\n/g, "<br>")}</p>
        </div>
      `,
    });

    // Email para o administrador
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: `Novo contato de ${nome}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Novo Contato Recebido</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="margin: 20px 0;">
          <p><strong>Mensagem:</strong></p>
          <p>${mensagem.replace(/\n/g, "<br>")}</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return false;
  }
}
