// lib/email.ts
import nodemailer from 'nodemailer'

/**
 * Sends a verification email to the given address with a token link.
 * The email configuration is expected to be provided via environment variables:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 */
export async function sendVerificationEmail(email: string, token: string) {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || user

  if (!host || !port || !user || !pass) {
    console.warn('SMTP configuration missing, email not sent')
    return
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/v1/newsletter/verify?token=${token}`

  const mailOptions = {
    from,
    to: email,
    subject: 'Confirm your subscription',
    html: `<p>Thanks for signing up for our newsletter! Please confirm your subscription by clicking the link below:</p>
           <p><a href="${verificationUrl}">${verificationUrl}</a></p>
           <p>This link will expire in 24 hours.</p>`,
  }

  await transporter.sendMail(mailOptions)
}
