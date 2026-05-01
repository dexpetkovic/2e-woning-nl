import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = 'elandsstudio@gmail.com';
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    if (AUDIENCE_ID) {
      await resend.contacts.create({
        email: normalizedEmail,
        audienceId: AUDIENCE_ID,
        unsubscribed: false,
      });
    }

    // Always notify admin
    await resend.emails.send({
      from: 'noreply@2e-woning.nl',
      to: ADMIN_EMAIL,
      subject: 'Nieuwe aanmelding — Box 3 tarieven notificatie',
      html: `<p>Nieuw e-mailadres aangemeld voor tarieven 2026: <strong>${normalizedEmail}</strong></p>`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}
