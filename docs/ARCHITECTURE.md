# ARCHITECTURE.md placeholder for StellarFlow

When a new collaboration begins, the parties agree on a **Split Map** — a pre-defined percentage breakdown of how all incoming revenue will be distributed. This Split Map is written into a Soroban smart contract at the time the **Stream** is initialized.

From that moment forward:

1. Revenue (in USDC or other Stellar assets) flows into the contract
2. The contract reads the Split Map
3. It fragments the incoming funds according to the agreed percentages
4. It routes the exact shares directly to each collaborator's wallet
5. No human touches the funds at any point

This is not a dashboard where a project lead clicks "Pay Out." This is a **programmable router** — the code enforces the agreement the moment funds arrive.

---

## 4. Why Soroban / Stellar?

| Problem | Why Soroban Solves It |
|---|---|
| Gas fees make micro-splits unviable | Soroban transaction fees are fractions of a cent |
| Cross-border payments are slow and expensive | Stellar settles in under 5 seconds globally |
| Trust bottleneck (manual payout) | Smart contract replaces human discretion entirely |
| No verifiable proof of splits | All transactions are publicly recorded on-chain |

StellarFlow **cannot be built on Ethereum** for real-world micro-split use cases. A $5 daily ad revenue split among three people would cost more in gas than the revenue itself. Soroban makes this economically viable.

---

## 5. Who Uses StellarFlow?

### Content Creators & Freelance Teams
A YouTuber splits sponsorship income with their scriptwriter, video editor, and thumbnail designer. The moment Stripe processes the sponsor payment, the backend detects it and triggers the contract to split it instantly.

### Indie Game Studios & Hackathon Teams
Five developers build an app together. Instead of trusting one teammate to distribute subscription revenue monthly, a StellarFlow contract handles it automatically per payment received.

### Music Producers & Artists
Collaborators on a track set their royalty shares at recording time. When streaming royalties are collected, the contract routes each artist's percentage directly to their wallet — no record label accounting delay.

### Open-Source Maintainers
A team receiving continuous grant funding or donations sets weighted shares for each regular contributor. Every incoming donation is auto-distributed according to contribution weight.

---

## 6. System Architecture — What Lives Where

StellarFlow follows a **hybrid on-chain / off-chain architecture**. This is intentional and important to understand.

### 6.1 The Core Rule

> **The blockchain cannot listen to the outside world.**

Stripe, YouTube, and Spotify do not know Soroban exists. When revenue is generated on these platforms, your smart contract has no way of detecting it on its own. This is where the off-chain backend becomes essential — not as a compromise, but as a **bridge layer**.

### 6.2 Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                  EXTERNAL REVENUE SOURCES               │
│         Stripe · YouTube API · Spotify · Custom         │
└────────────────────────┬────────────────────────────────┘
                         │ Webhooks / API Events
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  OFF-CHAIN BACKEND                      │
│  • Listens for revenue events                           │
│  • Verifies legitimacy of the event                     │
│  • Calculates trigger conditions                        │
│  • Calls the Soroban contract to release funds          │
│  • NEVER holds funds — only signals the contract        │
└────────────────────────┬────────────────────────────────┘
                         │ Contract Call (trigger payout)
                         ▼
┌─────────────────────────────────────────────────────────┐
│              ON-CHAIN SOROBAN CONTRACT                  │
│  • Holds the Split Map (percentages per stream)         │
│  • Holds escrowed funds                                 │
│  • Executes the split on trigger                        │
│  • Routes funds directly to collaborator wallets        │
│  • Source of truth — immutable once initialized         │
└────────────────────────┬────────────────────────────────┘
                         │ Direct transfers
                         ▼
┌─────────────────────────────────────────────────────────┐
│              COLLABORATOR WALLETS                       │
│         Each party receives their exact share           │
└─────────────────────────────────────────────────────────┘
```

### 6.3 What Lives Off-Chain

| Data | Reason |
|---|---|
| User profiles and dashboard data | Privacy, flexibility, cost |
| Revenue event detection (webhooks) | Blockchain cannot receive external API calls |
| Stream metadata (project names, descriptions) | Not needed on-chain |
| Trigger logic (when to fire the contract) | Flexible business rules |

### 6.4 What Lives On-Chain

| Data | Reason |
|---|---|
| Split Map (addresses + percentage shares) | Immutable agreement between parties |
| Escrowed funds | Trustless custody |
| Payout transactions | Verifiable proof of distribution |
| Stream initialization parameters | Source of truth for the collaboration terms |

### 6.5 Security Note on the Backend

A critical point: **the backend cannot steal funds.** It can only call the contract to trigger a payout to the pre-agreed wallet addresses. The contract will only ever send funds to the addresses written in the Split Map at initialization. The backend is the trigger — the contract is the vault that only opens to the agreed targets.

---

## 7. Smart Contract Design

### 7.1 Core Data Structures

```rust
// A single collaborator's share in a stream
pub struct Collaborator {
    pub address: Address,
    pub share_bps: u32, // Basis points: 5000 = 50%, 3000 = 30%, 2000 = 20%
}

// A revenue stream with its split configuration
pub struct Stream {
    pub stream_id: Symbol,
    pub owner: Address,
    pub collaborators: Vec<Collaborator>,
    pub asset: Address,       // e.g., USDC contract address
    pub is_active: bool,
    pub created_at: u64,
}
```

> **Note on Percentages:** Shares are stored as **basis points (BPS)** where 10,000 = 100%. This avoids floating point entirely. The sum of all collaborator `share_bps` values in a stream must always equal exactly **10,000**.

### 7.2 Core Contract Functions

```rust
// Initialize a new revenue stream with a fixed Split Map
pub fn initialize_stream(
    env: Env,
    stream_id: Symbol,
    collaborators: Vec<Collaborator>, // shares must sum to 10,000 BPS
    asset: Address,
) -> Result<StreamId, Error>

// Triggered by the backend when revenue arrives — splits and routes funds
pub fn distribute(
    env: Env,
    stream_id: Symbol,
    amount: i128,
) -> Result<(), Error>

// Owner can deactivate a stream (does not affect already-escrowed funds)
pub fn deactivate_stream(
    env: Env,
    stream_id: Symbol,
) -> Result<(), Error>

// View function — returns the Split Map for a given stream
pub fn get_stream(
    env: Env,
    stream_id: Symbol,
) -> Result<Stream, Error>
```

### 7.3 Percentage Logic

Percentages are **not hard-coded** in the contract source code. They are **parameters passed in at stream initialization**. This means:

- The same contract handles every stream with different splits
- A user can be in multiple streams with different percentage allocations
- Renegotiating a split requires deploying a new stream (the old one is immutable by design — this is a feature, not a limitation)

---

## 8. End-to-End Flow

### Step 1 — Stream Creation
The project owner (Maintainer) initializes a stream on-chain, passing in the collaborators' wallet addresses and their agreed percentage shares. The Split Map is now locked on-chain.

### Step 2 — Funds Deposited
USDC (or other Stellar asset) is deposited into the stream's escrow balance on the contract.

### Step 3 — Revenue Event Detected
A sponsorship payment lands in Stripe. YouTube pays out ad revenue. The off-chain backend's webhook listener detects this event.

### Step 4 — Backend Triggers the Contract
The backend verifies the event, calculates the amount to distribute, and calls the `distribute()` function on the Soroban contract.

### Step 5 — Contract Executes the Split
The contract reads the Split Map, calculates each collaborator's share in basis points, and fires separate transfers to each wallet in the same transaction.

### Step 6 — Collaborators Receive Funds
Each party sees their share arrive in their wallet directly, within seconds, regardless of where in the world they are.

---

## 9. Roles & Responsibilities

| Role | Who | Responsibilities |
|---|---|---|
| **Stream Owner / Maintainer** | Project lead | Initializes streams, defines Split Map, deposits funds |
| **Collaborator** | Any party in the Split Map | Receives automatic payouts, cannot alter the split |
| **Backend Operator** | Web2 integration layer | Listens to external revenue events, triggers contract |
| **Contract** | Soroban smart contract | Enforces split, holds funds, executes transfers |

---

## 10. Design Principles

- **Escrow-first:** Funds enter the contract before any distribution occurs
- **Immutable Split Maps:** Once a stream is initialized, the percentages cannot be changed — this is the trustless guarantee
- **Non-custodial:** The backend never holds funds; the contract is the only custodian
- **Minimal on-chain logic:** The contract is a precise vault and router, not a business logic engine
- **Off-chain intelligence:** Event detection, verification, and trigger logic remain flexible off-chain
- **No identities on-chain:** Only wallet addresses and numeric shares are stored on-chain

---

## 11. What StellarFlow Is (and Is Not)

### StellarFlow Is
- A programmable revenue router
- A trustless escrow and payout system
- A collaboration payment infrastructure layer

### StellarFlow Is Not
- A payroll system or HR tool
- A DAO governance platform
- A replacement for Stripe or YouTube
- A custodial payment platform

---

## 12. Repository Structure (Planned)

```
stellarflow/
├── contracts/
│   └── stellarflow/
│       ├── src/
│       │   ├── lib.rs          # Contract entry points
│       │   ├── storage.rs      # Storage keys and structs
│       │   ├── split.rs        # Split logic
│       │   └── errors.rs       # Error types
│       └── Cargo.toml
├── backend/
│   ├── src/
│   │   ├── listeners/          # Webhook handlers (Stripe, YouTube, etc.)
│   │   ├── trigger/            # Contract call logic
│   │   └── server.ts           # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── pages/              # Dashboard, Stream view, Create stream
│   │   └── hooks/              # Wallet connection, contract reads
│   └── package.json
├── tests/
│   ├── contract/               # Soroban unit & integration tests
│   └── backend/                # Backend unit tests
├── docs/
│   └── ARCHITECTURE.md         # This document
├── README.md
└── CONTRIBUTING.md
```

---
