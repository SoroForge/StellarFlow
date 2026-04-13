# 🔀 StellarFlow

> **Programmable, Non-Custodial Revenue Routing on Soroban**

StellarFlow is a decentralized payment splitter that automates royalty and revenue distribution for digital collaborations. It acts as a smart, immutable router for incoming funds — the moment stablecoins hit the contract, it instantly fragments the payment and routes exact percentage shares to each collaborator's wallet.

No manual transfers. No trust in a middleman. No delays. The code is the contract.

---

## 🚨 The Problem

When digital teams collaborate — creators, developers, musicians, open-source contributors — one person typically ends up holding the wallet and distributing revenue manually. This creates:

- A **trust bottleneck** — collaborators must trust one person to be fair and timely
- **Cross-border friction** — wire transfers take days and eat fees
- **No immutable record** — there is no on-chain proof of what was agreed
- **Micro-split impossibility** — gas fees on Ethereum make small, frequent splits economically unviable

---

## 💡 The Solution

StellarFlow lets collaborators lock a **Split Map** (e.g. 50% / 30% / 20%) into a Soroban smart contract at the start of a project. From that moment, all incoming revenue is automatically fragmented and routed to each party's wallet the instant it arrives — without any human intervention.

---

## ⚙️ How It Works

```
Revenue Source (Stripe / YouTube / Custom)
        │
        │  webhook event
        ▼
  Off-Chain Backend
  (detects revenue, triggers contract)
        │
        │  contract call
        ▼
  Soroban Smart Contract
  (reads Split Map, executes transfers)
        │
        ├──► Collaborator A Wallet  (50%)
        ├──► Collaborator B Wallet  (30%)
        └──► Collaborator C Wallet  (20%)
```

1. **Stream Owner** initializes a stream on-chain with wallet addresses and percentage shares
2. **Funds** are deposited into the stream's escrow on the contract
3. **Backend** listens for revenue events from external platforms via webhooks
4. **Backend** triggers the Soroban contract's `distribute()` function
5. **Contract** splits the funds per the locked Split Map and routes shares to each wallet

---

## 🚀 Why Soroban?

| Challenge | How Soroban Solves It |
|---|---|
| Gas makes micro-splits unviable | Transaction fees are fractions of a cent |
| Cross-border payments are slow | Stellar settles in under 5 seconds globally |
| Manual payout creates trust issues | Smart contract replaces human discretion |
| No verifiable proof of agreements | All splits are recorded immutably on-chain |

---

## 💼 Use Cases

- **Content Creator Teams** — auto-split sponsorship revenue with editors, writers, designers
- **Indie Game Studios** — distribute subscription/sale revenue without a trusted treasurer
- **Music Collaborators** — route streaming royalties to each artist's wallet instantly
- **Open-Source Teams** — distribute grant funding by weighted contribution shares

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Smart Contract | Rust / Soroban SDK |
| Blockchain | Stellar (Soroban Testnet → Mainnet) |
| Backend | Node.js / TypeScript |
| Frontend | React / TypeScript |
| Stablecoin | USDC (Stellar) |

---

## 🗂️ Project Structure

```
stellarflow/
├── contracts/
│       ├── src/
│       │   ├── lib.rs          # Contract entry points
│       │   ├── storage.rs      # Storage keys and structs
│       │   ├── split.rs        # Split execution logic
│       │   └── errors.rs       # Error types
│       └── Cargo.toml
├── backend/
│   ├── src/
│   │   ├── listeners/          # Webhook handlers
│   │   ├── trigger/            # Contract call logic
│   │   └── server.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
│   └── package.json
├── tests/
├── docs/
│   └── ARCHITECTURE.md
├── README.md
└── CONTRIBUTING.md
```

---

## 🏁 Getting Started

### 📌 Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup)
- [Node.js](https://nodejs.org/) v18+
- A Stellar testnet account funded via [Friendbot](https://friendbot.stellar.org/)

### 📥 1. Clone the Repository

```bash
git clone https://github.com/soro-forge/stellarflow.git
cd stellarflow
```

### 🔨 2. Build the Contract

```bash
cd contracts/stellarflow
cargo build --target wasm32-unknown-unknown --release
```

### 🧪 3. Run Contract Tests

```bash
cargo test
```

### 🌐 4. Deploy to Testnet

```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellarflow.wasm \
  --network testnet
```

### 🔌 5. Set Up the Backend

```bash
cd backend
npm install
cp .env.example .env   # Fill in your contract address and keys
npm run dev
```

### 💻 6. Set Up the Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🤝 Contributing

StellarFlow is a community-driven build under **Soro-Forge**. All tasks are scoped, labelled, and claimable via [Stellar Wave Program on Drips](https://www.drips.network/wave).

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before picking up any task.

---

## Documentation

Full architecture breakdown, contract design decisions, and data flow diagrams are in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

*Built with ❤️ by the Soro-Forge community on Stellar/Soroban.*
