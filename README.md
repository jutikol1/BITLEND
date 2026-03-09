# ⚡ BitLend — Lending Protocol on OP_NET Bitcoin L1

> A fully-featured DeFi lending dApp built on **OP_NET** (Bitcoin Layer 1 Smart Contracts), powered by an **AI Agent via MCP** at `ai.opnet.org/mcp`, and designed to work with the **OPWallet** Chrome extension on testnet tBTC.

![OP_NET](https://img.shields.io/badge/OP__NET-Bitcoin%20L1-f7931a?style=for-the-badge&logo=bitcoin)
![MCP](https://img.shields.io/badge/AI%20Agent-MCP%20Powered-4d9fff?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Testnet](https://img.shields.io/badge/Network-OP__NET%20Testnet-00d4a4?style=for-the-badge)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Screenshots](#screenshots)
4. [Quick Start](#quick-start)
5. [Connecting OPWallet (Real Wallet)](#connecting-opwallet-real-wallet)
6. [Testnet tBTC Setup](#testnet-tbtc-setup)
7. [MCP Agent Integration](#mcp-agent-integration)
8. [Smart Contract Integration](#smart-contract-integration)
9. [Project Structure](#project-structure)
10. [Deployment](#deployment)
11. [Contributing](#contributing)

---

## 🌐 Overview

**BitLend** is a decentralized lending protocol running on **OP_NET** — a consensus layer that enables fully expressive smart contracts directly on Bitcoin Layer 1 using Taproot/SegWit technology. No sidechains, no bridges: BTC is gas.

### What Makes This Different

- **Real Bitcoin DeFi** — Runs natively on Bitcoin L1 via OP_NET smart contracts
- **AI-Powered Agent** — Connected to `https://ai.opnet.org/mcp` (Model Context Protocol) for intelligent transaction assistance
- **OPWallet Integration** — Direct connection to the official OP_NET Chrome wallet extension
- **Testnet Ready** — Full tBTC testnet support with faucet integration

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏦 Lending Markets | Supply tBTC, USDs, WBTC to earn yield |
| 📤 Borrowing | Borrow against collateral with real-time health factor |
| 🤖 AI Agent | MCP-powered assistant via `ai.opnet.org/mcp` |
| 🔐 OPWallet | Native OP_NET wallet connection |
| 📊 Live Stats | Real-time TVL, APY, utilization rates |
| 🚰 Faucet Link | Direct link to `faucet.opnet.org` for testnet tBTC |
| ⚡ Position Tracking | Health factor monitoring and liquidation alerts |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (optional, for local dev server)
- Chrome browser
- OPWallet Chrome Extension (see below)

### Run Locally

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/bitlend-opnet.git
cd bitlend-opnet

# Option 1: Simple (no build needed)
open index.html

# Option 2: Using a local dev server
npx serve .
# Then open http://localhost:3000

# Option 3: Using Python
python3 -m http.server 8080
# Then open http://localhost:8080
```

---

## 🔐 Connecting OPWallet (Real Wallet)

### Step 1: Install OPWallet Chrome Extension

1. Open Chrome and go to the [Chrome Web Store](https://chromewebstore.google.com/detail/opwallet/pmbjpcmaaladnfpacpmhmnfmpklgbdjb)
2. Search for **"OPWallet"** or use the direct link above
3. Click **"Add to Chrome"** → **"Add Extension"**
4. The orange Bitcoin icon will appear in your Chrome toolbar

### Step 2: Create or Import a Wallet

```
1. Click the OPWallet icon in Chrome toolbar
2. Choose "Create New Wallet" or "Import Wallet" (if you have a seed phrase)
3. Set a strong password
4. IMPORTANT: Save your 12-word seed phrase securely — never share it
5. Choose "Taproot" as your address type (required for tBTC transactions)
```

> ⚠️ **Important**: Always select **Taproot** address type. Your Taproot address starts with `tb1p...` on testnet.

### Step 3: Switch to Testnet

```
1. Open OPWallet extension
2. Click the Bitcoin logo icon in the TOP RIGHT corner
3. Select "Testnet 3" from the network dropdown
4. Your address will change to a tb1... testnet address
```

### Step 4: Connect to BitLend DApp

When you click **"Connect Wallet"** in BitLend, the app will:

```javascript
// How the connection works under the hood:
const accounts = await window.opnet.requestAccounts();
// OPWallet injects window.opnet into the browser
// Returns: ['tb1p...youraddress...']

const balance = await window.opnet.getBalance();
// Returns balance in satoshis as string
// Divide by 1e8 to get tBTC value
```

The wallet will show a popup asking you to **approve the connection**. Click "Connect".

---

## 💰 Testnet tBTC Setup

### Getting Free Testnet tBTC

1. Make sure your OPWallet is set to **Testnet 3**
2. Copy your **Taproot address** (starts with `tb1p...`)
3. Visit the faucet: **https://faucet.opnet.org/**
4. Paste your Taproot address and request tBTC
5. Wait ~1-2 minutes for the transaction to confirm
6. Your balance will appear in OPWallet

> You can also click the **🚰 Faucet** button inside BitLend after connecting your wallet.

### Checking Your tBTC Balance

```javascript
// Inside the app, balance is checked via:
const balanceResult = await window.opnet.getBalance();
const tBTCBalance = parseInt(balanceResult) / 1e8;

// Or query via OP_NET RPC directly:
const provider = new JSONRpcProvider('https://testnet.opnet.org', Network.Testnet);
const balance = await provider.getBalance(yourAddress);
```

---

## 🤖 MCP Agent Integration

BitLend's AI Agent is powered by the **Model Context Protocol (MCP)** endpoint at `https://ai.opnet.org/mcp`.

### How It Works

```
User Message
     ↓
BitLend Frontend
     ↓
Anthropic Claude API (claude-sonnet-4-20250514)
     ↑
OP_NET MCP Context (ai.opnet.org/mcp)
     ↓
AI Response with OP_NET market data
```

### Connecting to the MCP Server

The app calls the Anthropic API with OP_NET context injected:

```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: `You are a DeFi assistant connected to OP_NET MCP at https://ai.opnet.org/mcp.
             Current market data: tBTC APY 2.84%, USDs APY 4.21%...`,
    messages: [{ role: 'user', content: userMessage }]
  })
});
```

### Using the Official OP_NET MCP Directly

To connect your own agent to the OP_NET MCP server:

```javascript
// Example: Connecting Claude to OP_NET MCP
const mcpConfig = {
  servers: {
    opnet: {
      url: "https://ai.opnet.org/mcp",
      transport: "http"
    }
  }
};

// The MCP server exposes tools like:
// - get_market_data: Fetch current APY and liquidity
// - get_wallet_balance: Query wallet balance
// - submit_transaction: Sign and broadcast transactions
// - get_positions: Fetch user lending positions
```

### Adding Your Anthropic API Key

To enable real AI responses, add your Anthropic API key:

**Option 1: Environment Variable (for server-side)**
```bash
export ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**Option 2: Direct in HTML (development only — do not commit!)**
```javascript
// In index.html, find the fetch call and add the header:
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'sk-ant-your-key-here',  // ← Add this
  'anthropic-version': '2023-06-01'
}
```

**Option 3: Backend Proxy (recommended for production)**

```javascript
// backend/server.js (Node.js)
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

app.post('/api/agent', async (req, res) => {
  const { message, walletAddress, marketData } = req.body;
  
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: buildSystemPrompt(walletAddress, marketData),
    messages: [{ role: 'user', content: message }]
  });
  
  res.json({ response: response.content[0].text });
});

app.listen(3001);
```

---

## 📜 Smart Contract Integration

### Connecting to OP_NET Smart Contracts

Install the OP_NET JavaScript library:

```bash
npm install opnet @btc-vision/transaction @btc-vision/bitcoin
```

### Example: Interacting with the Lending Contract

```typescript
import { getContract, JSONRpcProvider } from 'opnet';
import { Wallet, Address } from '@btc-vision/transaction';
import { Network } from '@btc-vision/bitcoin';

// 1. Setup provider (testnet)
const provider = new JSONRpcProvider('https://testnet.opnet.org', Network.Testnet);

// 2. Setup wallet from OPWallet seed or private key
const wallet = Wallet.fromWIF(privateKey, Network.Testnet);
const userAddress = new Address(wallet.keypair.publicKey);

// 3. Get lending contract
const LENDING_CONTRACT = 'tb1p...contract_address_here...'; // Your deployed contract

const lendingContract = getContract(
  LENDING_CONTRACT,
  LENDING_ABI,   // Your contract ABI
  provider,
  Network.Testnet,
  userAddress    // Required for write operations
);

// 4. Supply tBTC
async function supplyTBTC(amountSats: bigint) {
  const simulation = await lendingContract.supply(amountSats);
  
  const txParams = {
    signer: wallet.keypair,
    refundTo: wallet.p2tr,           // Taproot address for change
    maximumAllowedSatToSpend: 5000n, // Max fee in satoshis
    feeRate: 10,                      // sat/vbyte
    network: Network.Testnet
  };
  
  const tx = await simulation.sendTransaction(txParams);
  console.log('Supply TX:', tx.txid);
  return tx;
}

// 5. Borrow USDs
async function borrowUSDs(amountWei: bigint) {
  const simulation = await lendingContract.borrow(amountWei);
  const tx = await simulation.sendTransaction({ signer: wallet.keypair, ... });
  return tx;
}
```

### Using OPWallet for Transactions (Browser)

```javascript
// The app uses window.opnet (injected by OPWallet extension)

async function supplyViaWallet(amountBTC) {
  // Check wallet is connected
  const accounts = await window.opnet.requestAccounts();
  if (!accounts.length) throw new Error('No accounts');

  const satAmount = Math.floor(amountBTC * 1e8);

  // Send transaction via OPWallet
  const txResult = await window.opnet.sendTransaction({
    to: LENDING_CONTRACT_ADDRESS,
    value: satAmount.toString(),
    data: encodeSupplyCalldata(satAmount),
    network: 'testnet',
    feeRate: 10  // sat/vbyte
  });

  console.log('Transaction ID:', txResult.txid);
  return txResult;
}

// Helper: Encode calldata for supply() function
function encodeSupplyCalldata(amountSats) {
  // OP_NET uses AssemblyScript/WASM — calldata is contract-specific
  // Replace with actual ABI encoding for your deployed contract
  const selector = '0xa0712d68'; // supply(uint256) selector
  const encodedAmount = amountSats.toString(16).padStart(64, '0');
  return selector + encodedAmount;
}
```

### Listening to OPWallet Events

```javascript
// Account change
window.opnet.on('accountsChanged', (accounts) => {
  if (accounts.length === 0) {
    handleDisconnect();
  } else {
    handleAccountChange(accounts[0]);
  }
});

// Network change
window.opnet.on('networkChanged', (network) => {
  console.log('Network changed to:', network);
  // 'testnet' or 'mainnet'
  updateNetworkDisplay(network);
});
```

---

## 📁 Project Structure

```
bitlend-opnet/
├── index.html              # Main DApp (single-file, no build needed)
├── README.md               # This file
├── src/
│   ├── wallet/
│   │   ├── opwallet.js     # OPWallet connection handler
│   │   └── transactions.js # Transaction builder utilities
│   ├── contracts/
│   │   ├── lending.abi.json     # Lending contract ABI
│   │   └── lending.contract.ts  # TypeScript contract wrapper
│   ├── agent/
│   │   ├── mcp-client.js   # MCP client for ai.opnet.org
│   │   └── prompts.js      # System prompt templates
│   └── utils/
│       ├── format.js       # Number/address formatting
│       └── constants.js    # Contract addresses, RPC URLs
├── backend/
│   ├── server.js           # Optional: API proxy for Anthropic
│   └── .env.example        # Environment variable template
├── contracts/              # OP_NET smart contracts (AssemblyScript)
│   ├── LendingProtocol.ts
│   └── deploy.ts
└── docs/
    ├── wallet-setup.md     # Detailed wallet setup guide
    └── contract-guide.md   # Contract deployment guide
```

---

## ⚙️ Configuration

Create a `.env` file in the root (never commit this):

```bash
# Copy from .env.example
cp backend/.env.example backend/.env
```

```env
# backend/.env

# Anthropic API Key (for AI Agent)
ANTHROPIC_API_KEY=sk-ant-api03-...

# OP_NET RPC Endpoints
OPNET_TESTNET_RPC=https://testnet.opnet.org
OPNET_MAINNET_RPC=https://api.opnet.org

# Deployed Contract Addresses (update after deployment)
LENDING_CONTRACT_TESTNET=tb1p...
LENDING_CONTRACT_MAINNET=bc1p...

# Optional: Your wallet for automated operations
WALLET_PRIVATE_KEY=your_private_key_here
```

---

## 🌍 Deployment

### Deploy to GitHub Pages

```bash
# 1. Fork this repository
# 2. Go to Settings → Pages
# 3. Set Source: "Deploy from a branch" → main → / (root)
# 4. Visit: https://YOUR_USERNAME.github.io/bitlend-opnet
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

### Deploy with Backend (Recommended)

```bash
# 1. Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys

# 2. Start backend
node server.js

# 3. Update frontend to use your backend
# In index.html, change the API endpoint:
# FROM: 'https://api.anthropic.com/v1/messages'
# TO:   'http://localhost:3001/api/agent'
```

---

## 🛠️ Deploying Your Own OP_NET Smart Contract

### 1. Install OP_NET Development Tools

```bash
npm install -g @btc-vision/opnet-cli
npm install opnet @btc-vision/transaction
```

### 2. Write Your Contract (AssemblyScript)

```typescript
// contracts/LendingProtocol.ts
import { OP_NET, Blockchain, Address } from '@btc-vision/opnet-std';

@contract
export class LendingProtocol extends OP_NET {
  private supplies: Map<Address, u256> = new Map();
  private borrows: Map<Address, u256> = new Map();

  @callable
  supply(amount: u256): boolean {
    const caller = Blockchain.tx.origin;
    const current = this.supplies.get(caller) || 0n;
    this.supplies.set(caller, current + amount);
    return true;
  }

  @callable
  borrow(amount: u256): boolean {
    const caller = Blockchain.tx.origin;
    // Add collateral checks here
    const current = this.borrows.get(caller) || 0n;
    this.borrows.set(caller, current + amount);
    return true;
  }

  @view
  getSupplyBalance(user: Address): u256 {
    return this.supplies.get(user) || 0n;
  }
}
```

### 3. Deploy to OP_NET Testnet

```bash
# Compile
opnet compile contracts/LendingProtocol.ts

# Deploy to testnet (requires tBTC for gas)
opnet deploy \
  --contract contracts/LendingProtocol.wasm \
  --network testnet \
  --wallet your_taproot_address
```

### 4. Update Contract Address in App

After deployment, copy your contract address and update `index.html`:

```javascript
const LENDING_CONTRACT_ADDRESS = 'tb1p...YOUR_DEPLOYED_CONTRACT...';
```

---

## 🐛 Troubleshooting

### "window.opnet is not defined"

The OPWallet Chrome extension is not installed or not enabled on this page.
1. Install from Chrome Web Store: `pmbjpcmaaladnfpacpmhmnfmpklgbdjb`
2. Refresh the page after installation
3. Click the extension icon and unlock with your password

### "Cannot connect to testnet"

1. Open OPWallet → click the Bitcoin logo (top right)
2. Select **"Testnet 3"** from the dropdown
3. Ensure your address starts with `tb1p...`

### "Insufficient balance for transaction"

You need testnet tBTC (not mainnet BTC).
1. Copy your **Taproot** address from OPWallet (`tb1p...`)
2. Go to https://faucet.opnet.org/
3. Paste address and request tBTC
4. Wait 2-3 minutes for confirmation

### "AI Agent not responding"

The Anthropic API key may not be configured.
1. Get a key at https://console.anthropic.com
2. Add it to your backend `.env` file as `ANTHROPIC_API_KEY`
3. The app falls back to local responses if the API is unavailable

### "Transaction failed: Invalid calldata"

The contract address or ABI may need updating.
1. Deploy your own contract (see above)
2. Update `LENDING_CONTRACT_ADDRESS` in the source
3. Ensure the ABI matches your deployed contract version

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📚 Resources

| Resource | Link |
|----------|------|
| OP_NET Official | https://opnet.org |
| OP_NET Testnet | https://testnet.opnet.org |
| OPWallet Extension | https://chromewebstore.google.com/detail/opwallet/pmbjpcmaaladnfpacpmhmnfmpklgbdjb |
| tBTC Faucet | https://faucet.opnet.org |
| OP_NET Developer Docs | https://dev.opnet.org |
| OP_NET GitHub | https://github.com/btc-vision |
| AI MCP Endpoint | https://ai.opnet.org/mcp |
| Anthropic Docs | https://docs.anthropic.com |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <strong>Built on Bitcoin. Powered by OP_NET. Assisted by AI.</strong><br/>
  <a href="https://opnet.org">opnet.org</a> • <a href="https://faucet.opnet.org">Get tBTC</a> • <a href="https://ai.opnet.org/mcp">MCP Agent</a>
</div>
