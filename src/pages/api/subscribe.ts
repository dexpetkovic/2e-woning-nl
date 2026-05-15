import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = 'dexpetkovic@gmail.com';
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

const isDuplicateError = (err: unknown): boolean => {
  if (!err || typeof err !== 'object') return false;
  const e = err as { name?: string; message?: string; statusCode?: number };
  const msg = (e.message || '').toLowerCase();
  return (
    msg.includes('already exist') ||
    msg.includes('duplicate') ||
    e.name === 'validation_error' ||
    e.statusCode === 409
  );
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  let alreadyExists = false;

  try {
    if (AUDIENCE_ID) {
      const { error: contactError } = await resend.contacts.create({
        email: normalizedEmail,
        audienceId: AUDIENCE_ID,
        unsubscribed: false,
      });

      if (contactError) {
        if (isDuplicateError(contactError)) {
          alreadyExists = true;
        } else {
          throw contactError;
        }
      }
    }

    // Notify admin only for genuinely new signups
    if (!alreadyExists) {
      await resend.emails.send({
        from: 'noreply@2e-woning.nl',
        to: ADMIN_EMAIL,
        subject: 'Nieuwe aanmelding - Box 3 tarieven notificatie',
        html: `<p>Nieuw e-mailadres aangemeld voor tarieven 2026: <strong>${normalizedEmail}</strong></p>`,
      });
    }

    return res.status(200).json({ ok: true, alreadyExists });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}
