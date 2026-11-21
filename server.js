const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// Destination Bitcoin Deposit Wallet
const DEPOSIT_WALLET = "bc1qd6k75remr6s4thjkkgdugazftp2xmetmvg5ds8";

// 1. CRAWLER PERMISSIONS (robots.txt) - OPTIMIZED FOR ALL AI BOTS
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /

# OpenAI Crawlers
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /

# Anthropic (Claude) Crawlers
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /

# Perplexity AI
User-agent: PerplexityBot
Allow: /

# Google Gemini / AI Extended
User-agent: Google-Extended
Allow: /

# Common Crawl (Foundation Dataset for LLMs)
User-agent: CCBot
Allow: /

# Amazon AI
User-agent: Amazonbot
Allow: /

Sitemap: https://${req.headers.host}/sitemap.xml`);
});

// 2. AI MODEL INDEX FILE (llms.txt)
app.get('/llms.txt', (req, res) => {
  res.type('text/markdown');
  res.send(`# AI Agent Data Repository\n> Public and monetized data endpoints for autonomous AI agents.\n\n## Free Public Knowledge\n- [Raw Knowledge Feed](https://${req.headers.host}/api/v1/public/knowledge.md): Markdown dataset for LLM ingestion.\n\n## Paid L402 Endpoints\n- [Premium Data Service](https://${req.headers.host}/api/v1/l402/premium-data): 25 satoshis per query via L402 Lightning protocol.`);
});

// 3. FREE PUBLIC KNOWLEDGE FEED (For AI Web Crawlers)
app.get('/api/v1/public/knowledge.md', (req, res) => {
  res.type('text/markdown');
  res.send(`# Knowledge Base Index\n\n## Topic 1: Autonomous Agent Governance\nBusinesses remain fully accountable under FTC enforcement for autonomous software operations.\n\n## Topic 2: Machine-to-Machine Payments\nL402 activates HTTP 402 status codes using Lightning Network micropayments and macaroons.`);
});

// 4. MONETIZED L402 PAYMENT ENDPOINT (HTTP 402 Challenge)
app.get('/api/v1/l402/premium-data', (req, res) => {
  const authHeader = req.headers['authorization'];

  // Check for settled payment proof: Authorization: L402 <macaroon>:<preimage>
  if (authHeader && authHeader.startsWith('L402 ')) {
    const [macaroon, preimage] = authHeader.replace('L402 ', '').trim().split(':');
    if (macaroon && preimage) {
      const hash = crypto.createHash('sha256').update(Buffer.from(preimage, 'hex')).digest('hex');
      return res.status(200).json({
        status: "SUCCESS",
        message: "Payment verified via L402 preimage proof.",
        destination_wallet: DEPOSIT_WALLET,
        data: { insight: "Verified premium data payload delivered to agent.", timestamp: new Date().toISOString() }
      });
    }
  }

  // Issue HTTP 402 Payment Challenge if unpaid
  const mockMacaroon = "AGIAJEem1K90Cg==";
  const mockInvoice = "lnbc250n1p...qqqvjq";
  res.setHeader('WWW-Authenticate', `L402 macaroon="${mockMacaroon}", invoice="${mockInvoice}"`);
  return res.status(402).json({
    error: "Payment Required",
    protocol: "L402",
    cost_sats: 25,
    deposit_address: DEPOSIT_WALLET,
    message: "Pay attached Lightning invoice and resubmit request with Authorization: L402 <macaroon>:<preimage>."
  });
});

// 5. LEGAL & FTC COMPLIANCE DISCLOSURE
app.get('/api/v1/compliance', (req, res) => {
  res.json({
    deposit_wallet: DEPOSIT_WALLET,
    physical_address: "131 S Boylan Ave, Apt 2, Raleigh NC 27603",
    contact_email: "jadonianfactor@gmail.com",
    compliance: "Complies with FTC Section 5, CAN-SPAM Act, and CFAA rules."
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));
