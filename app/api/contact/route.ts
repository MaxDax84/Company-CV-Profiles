import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const message = (formData.get('message') as string | null)?.trim() ?? ''
  const attachment = formData.get('attachment') as File | null
  const existingSite = (formData.get('existingSite') as string | null)?.trim() ?? ''

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  if (attachment && attachment.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File exceeds 5MB limit.' }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  // Build attachments array
  type Attachment = { filename: string; content: Buffer }
  const attachments: Attachment[] = []
  if (attachment && attachment.size > 0) {
    const buffer = Buffer.from(await attachment.arrayBuffer())
    attachments.push({ filename: attachment.name, content: buffer })
  }

  try {
    await transporter.sendMail({
      from: `"BeOnWeb Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New enquiry from ${escapeHtml(name)} — BeOnWeb`,
      text: `Name: ${name}\nEmail: ${email}\n${existingSite ? `Existing site: ${existingSite}\n` : ''}\nMessage:\n${message}${attachment ? `\n\nAttachment: ${attachment.name}` : ''}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; background: #0a0b14; color: #f0f0f5; padding: 32px; border-radius: 12px; border: 1px solid #2a2d3e;">
          <div style="margin-bottom: 24px;">
            <h2 style="margin: 0 0 4px; color: #5b9cf6; font-size: 20px;">New BeOnWeb Enquiry</h2>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Received via the contact form</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; font-size: 14px; width: 80px;">Name</td>
              <td style="padding: 8px 0; font-size: 14px;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">Email</td>
              <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${escapeHtml(email)}" style="color: #5b9cf6;">${escapeHtml(email)}</a></td>
            </tr>
            ${existingSite ? `<tr>
              <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">Existing site</td>
              <td style="padding: 8px 0; font-size: 14px;"><a href="${escapeHtml(existingSite)}" style="color: #5b9cf6;">${escapeHtml(existingSite)}</a></td>
            </tr>` : ''}
            ${attachment ? `<tr>
              <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">Attachment</td>
              <td style="padding: 8px 0; font-size: 14px;">${escapeHtml(attachment.name)}</td>
            </tr>` : ''}
          </table>
          <div style="background: #161825; border-radius: 8px; padding: 16px; border-left: 3px solid #5b9cf6;">
            <p style="margin: 0 0 8px; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
            <p style="margin: 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
        </div>
      `,
      attachments,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }
}
