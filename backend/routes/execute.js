const router = require('express').Router();
const codeRunner = require('../services/codeRunner');

// POST /api/execute — runs code in sandbox
router.post('/', async (req, res) => {
  const { code, language = 'javascript' } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Code content required' });
  }

  try {
    let result;
    if (language === 'python') {
      result = await codeRunner.executePython(code);
    } else {
      result = await codeRunner.executeJS(code);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
