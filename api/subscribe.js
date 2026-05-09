export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, card } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  const timestamp = new Date().toISOString();

  // Save to Google Sheet as confirmed directly (empty token to keep column alignment)
  await fetch(process.env.APPS_SCRIPT_URL, {
    method: 'POST',
    body: new URLSearchParams({ email, card, timestamp, token: '', status: 'confirmed' })
  });

  // Send welcome email via Resend
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'the dental fear <hello@thedentalfear.com>',
      to: email,
      subject: "You're on the list.",
      html: `
        <div style="font-family:'DM Sans',sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#F5F2EE;color:#1A1A1A;">
          <p style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#8A8078;margin-bottom:24px;">the dental fear</p>
          <p style="font-size:20px;font-weight:400;line-height:1.4;margin-bottom:16px;">You're on the list. Thank you!</p>
          <p style="font-size:16px;font-weight:300;color:#4A4540;line-height:1.7;margin-bottom:32px;">We'll reach out when it's ready. Can't wait to tell you more.</p>
          <p style="font-size:12px;color:#B0A898;font-style:italic;">No spam — ever. We mean it.</p>
        </div>
      `
    })
  });

  return res.status(200).json({ result: 'success' });
}
