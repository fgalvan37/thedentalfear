export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Invalid link.');
  }

  // Update Google Sheet status to confirmed
  await fetch(process.env.APPS_SCRIPT_URL, {
    method: 'POST',
    body: new URLSearchParams({ token, status: 'confirmed' })
  });

  // Redirect to confirmation page
  return res.redirect(302, '/?confirmed=true');
}
