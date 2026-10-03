const router = require('express').Router();

// GitHub OAuth — redirect to GitHub
router.get('/github', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID || 'YOUR_GITHUB_CLIENT_ID',
    redirect_uri: 'http://localhost:4000/auth/github/callback',
    scope: 'repo read:user',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

// GitHub OAuth callback
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('http://localhost:3001?auth=error');

  try {
    const axios = require('axios');
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      { client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code },
      { headers: { Accept: 'application/json' } }
    );
    const token = response.data.access_token;
    // Send token back to frontend via query param (in production use secure cookies)
    res.redirect(`http://localhost:3001?auth=github&token=${token}`);
  } catch (err) {
    res.redirect('http://localhost:3001?auth=error');
  }
});

module.exports = router;
