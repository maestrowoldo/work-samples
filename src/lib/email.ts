import process from "node:process";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_PORT === "465", // true para porta 465 (SSL), false para 587 e 2525
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // Configuração para Mailtrap e outros provedores
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendContactEmail(
  nome: string,
  email: string,
  mensagem: string,
  celular?: string
) {
  try {
    // Email para o usuário - confirmar recebimento
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Recebemos sua mensagem! ",
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

    // Email para o administrador com a mensagem completa
    const adminEmail = process.env.EMAIL_ADMIN_TO || process.env.EMAIL_FROM;
    if (adminEmail && adminEmail.includes("@")) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: adminEmail,
        subject: `📩 Novo contato de ${nome}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333;">📬 Novo Contato Recebido</h2>
            <div style="background: white; padding: 15px; border-radius: 5px;">
              <p><strong>👤 Nome:</strong> ${nome}</p>
              <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
              ${celular ? `<p><strong>📱 Celular:</strong> <a href="tel:${celular.replace(/\D/g, "")}">${celular}</a></p>` : ""}
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
              <p><strong>💬 Mensagem:</strong></p>
              <p style="white-space: pre-wrap; background: #fafafa; padding: 10px; border-left: 4px solid #007bff;">${mensagem}</p>
            </div>
          </div>
        `,
      });
    }

    // Log de sucesso
    console.log("✅ Email enviado com sucesso para:", email);

    return true;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return false;
  }
}
