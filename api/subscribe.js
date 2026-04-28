export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, card } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  const token = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  await fetch(process.env.APPS_SCRIPT_URL, {
    method: 'POST',
    body: new URLSearchParams({ email, card, timestamp, token, status: 'pending' })
  });

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'the dental fear <hello@thedentalfear.com>',
      to: email,
      subject: 'One last step — we promise.',
      html: `
        <div style="font-family:'DM Sans',sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#F5F2EE;color:#1A1A1A;">
          <p style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#8A8078;margin-bottom:24px;">the dental fear</p>
          <p style="font-size:20px;font-weight:400;line-height:1.4;margin-bottom:16px;">One last step.</p>
          <p style="font-size:16px;font-weight:300;color:#4A4540;line-height:1.7;margin-bottom:32px;">Click the button below to confirm your email and secure your spot.</p>
          <a href="https://thedentalfear.com/api/confirm?token=${token}" style="display:inline-block;background:#1A1A1A;color:#F5F2EE;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:16px;">Yes, confirm me</a>
          <p style="margin-top:32px;font-size:12px;color:#B0A898;font-style:italic;">If you didn't sign up for this, just ignore this email.</p>
        </div>
      `
    })
  });

  return res.status(200).json({ result: 'success' });
}
