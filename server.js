// backend/server.js
// Optional Node.js backend proxy for Anthropic API calls
// This keeps your API key secure on the server side

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// OP_NET market data (in production, fetch from OP_NET RPC)
function getMarketData() {
  return {
    tBTC: { supplyAPY: 2.84, borrowAPY: 5.61, utilization: 43 },
    USDs: { supplyAPY: 4.21, borrowAPY: 7.85, utilization: 67 },
    WBTC: { supplyAPY: 3.15, borrowAPY: 6.02, utilization: 39 },
    tvl: '$4.21M',
    network: 'OP_NET Testnet'
  };
}

function buildSystemPrompt(walletAddress, marketData) {
  return `You are BitLend AI Agent, an intelligent DeFi assistant for a lending protocol built on OP_NET — Bitcoin Layer 1 smart contracts.

You are connected to the OP_NET MCP server at https://ai.opnet.org/mcp.

Current market state:
${JSON.stringify(marketData, null, 2)}

User wallet: ${walletAddress || 'Not connected'}

Guidelines:
- Be concise and helpful
- Format numbers clearly (e.g., 2.84% APY, 0.1 tBTC)
- For transactions, guide users to use the Supply/Borrow buttons in the UI
- Warn about risks (liquidation, health factor)
- Network is OP_NET Testnet — use tBTC, not real BTC`;
}

// POST /api/agent — AI agent endpoint
app.post('/api/agent', async (req, res) => {
  try {
    const { message, walletAddress } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
    }

    const marketData = getMarketData();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: buildSystemPrompt(walletAddress, marketData),
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    const agentResponse = data.content?.[0]?.text || 'No response';

    res.json({
      response: agentResponse,
      model: data.model,
      usage: data.usage
    });

  } catch (error) {
    console.error('Agent error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/markets — Fetch market data from OP_NET
app.get('/api/markets', (req, res) => {
  // In production: query OP_NET RPC for real data
  res.json(getMarketData());
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`BitLend Backend running on http://localhost:${PORT}`);
  console.log(`API Key: ${ANTHROPIC_API_KEY ? 'Configured ✓' : 'MISSING ✗'}`);
});
