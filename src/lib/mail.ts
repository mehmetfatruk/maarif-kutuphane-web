import "server-only";
import nodemailer from "nodemailer";

function escape(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Etiket–değer listesini e-posta olarak gönderir. SMTP ayarlanmamışsa (geliştirme) konsola yazar. */
export async function sendForm(subject: string, rows: [string, string][], replyTo?: string) {
  const to = process.env.FORM_MAIL_TO;
  const text = rows.map(([k, v]) => `${k}: ${v || "-"}`).join("\n");
  const html = `<h2 style="color:#234c77">${escape(subject)}</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><th align="left" style="color:#234c77">${escape(k)}</th><td>${escape(v || "-").replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;

  if (!process.env.SMTP_HOST || !to) {
    if (process.env.NODE_ENV === "production") throw new Error("SMTP_HOST ve FORM_MAIL_TO ayarlanmamış.");
    console.info(`[e-posta gönderilmedi: SMTP ayarlı değil]\n${subject}\n${text}`);
    return;
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  await transport.sendMail({
    from: process.env.MAIL_FROM ?? process.env.SMTP_USER,
    to,
    replyTo,
    subject,
    text,
    html,
  });
}
