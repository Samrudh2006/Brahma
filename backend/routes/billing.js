const router = require('express').Router();

const SUBSCRIPTION_PLANS = [
  {
    id: 'plan_free',
    name: 'Free Explorer',
    price: 0,
    interval: 'month',
    tokensPerDay: '50,000',
    swarmsAllowed: 3,
    models: 'DeepSeek R1, Llama 3.3 70B, Qwen 2.5 Coder',
    features: ['Standard Latency', 'Community Discord', 'Basic AST Verification'],
  },
  {
    id: 'plan_pro',
    name: 'Pro Sovereign ($19/mo)',
    price: 19,
    interval: 'month',
    tokensPerDay: '2,000,000',
    swarmsAllowed: 289,
    models: 'All 20+ Frontier Models (Claude 3.7, o3-mini, Gemini 2.0 Pro)',
    features: ['Priority Latency (<200ms)', 'Lean 4 Formal Math Prover', 'DeepMind FunSearch Lab Unlimited', 'Private Cloud Storage'],
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise Matrix ($99/mo)',
    price: 99,
    interval: 'month',
    tokensPerDay: 'Unlimited Token Stream',
    swarmsAllowed: 'Unlimited Custom Swarms',
    models: 'Dedicated Private vLLM Cluster',
    features: ['Custom Model Fine-Tuning LoRA Pipeline', 'SLA 99.99%', 'SOC-2 Compliance', 'Dedicated Solutions Architect'],
  }
];

// GET /api/billing/plans
router.get('/plans', (req, res) => {
  res.json({ plans: SUBSCRIPTION_PLANS });
});

// POST /api/billing/checkout
router.post('/checkout', (req, res) => {
  const { planId = 'plan_pro' } = req.body;
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId) || SUBSCRIPTION_PLANS[1];
  
  // Return mock Stripe / Razorpay session
  res.json({
    success: true,
    sessionId: `cs_brahma_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    checkoutUrl: `https://checkout.stripe.com/pay/brahma_${plan.id}`,
    plan,
    status: 'ACTIVE_INTENT'
  });
});

module.exports = router;
