export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Invalid link.');
  }

  await fetch(process.env.APPS_SCRIPT_URL, {
    method: 'POST',
    body: new URLSearchParams({ token, status: 'confirmed' })
  });

  return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>the dental fear</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{min-height:100svh;background:#F5F2EE;font-family:'DM Sans',sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;text-align:center;}
  .dot{color:#8A8078;font-size:22px;margin-bottom:24px;display:block;}
  .title{font-size:clamp(24px,4vw,36px);font-weight:400;color:#1A1A1A;margin-bottom:16px;line-height:1.3;}
  .sub{font-size:16px;font-weight:300;color:#8A8078;line-height:1.7;max-width:400px;margin:0 auto 40px;}
  .thanks{font-size:13px;font-weight:300;font-style:italic;color:#B0A898;}
  .logo{margin-top:64px;opacity:0.6;max-width:100px;}
</style>
</head>
<body>
  <span class="dot">·</span>
  <h1 class="title">You're on the list.</h1>
  <p class="sub">We'll be in touch when it's ready.</p>
  <p class="thanks">Thanks for confirming — we really mean it.</p>
  <img src="/the_dental_fear_logo_2.png" alt="the dental fear" class="logo"/>
</body>
</html>`);
}
