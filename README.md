# BitLasso

Work becomes value. Value returns as opportunity.

BitLasso turns completed work into Bitcoin-anchored receipts that power repeat business.

Each paid project can mint a verifiable work receipt.
Clients redeem those receipts for discounts on future projects — creating a continuous loop of collaboration.

Proof of Work becomes Proof of Loyalty.

## Motivation
Most loyalty systems reward spending. Crypto loyalty often rewards speculation.

BitLasso rewards completed work.

There is no durable mechanism in B2B relationships to:

- Tokenize delivered value
- Anchor it to Bitcoin
- Make it redeemable
- Reinforce long-term collaboration
- Payments are isolated events. BitLasso turns them into recurring relationships.

## Value proposition
BitLasso is a non-custodial system that:

- Generates Bitcoin payment requests
- Mints work receipts after payment confirmation
- Allows clients to redeem receipts for future discounts
- Keeps custody with the issuer and the client
- Funds never pass through BitLasso.

This is operational real-world asset (oRWA) — grounded in delivered work, not speculation.

## The Loop of Work
- Get Paid: Create a Bitcoin payment request and receive funds directly to your wallet.
- Issue a Receipt: Once payment is confirmed, mint a work receipt to your client’s wallet.
- Build Loyalty: Each receipt represents completed work and earned trust.
- Redeem: Clients redeem receipts for discounts on future projects — restarting the loop.
- Four steps. One continuous loop.

## Design Principles

- Bitcoin-first
- Non-custodial by default
- Receipts minted only after confirmed payment
- No speculation
- No financial engineering
- No custody of funds

## Development

A monorepo containing the BitLasso SDK and UI application, with the UI fully integrated to use the SDK for all API operations.

The monorepo restructuring and SDK-UI integration has been successfully completed:

- **SDK Package**: Created as `packages/sdk/` with full TypeScript support
- **UI Integration**: All API calls in the UI now use the SDK
- **Type Safety**: Consistent types across both packages
- **Build System**: npm workspaces with separate build scripts
- **Development**: Dev server runs successfully with hot reload

Structure is defined as followed:

```
bitlasso/
├── packages/
│   ├── sdk/           # @bitlasso/sdk - TypeScript SDK package
│   │   ├── src/       # Source files (api.ts, auth.ts, wallet.ts, etc.)
│   │   ├── dist/      # Compiled JavaScript and type definitions
│   │   ├── package.json
│   │   └── README.md  # SDK documentation
│   └── ui/            # @bitlasso/ui - React UI application
│       ├── src/       # React components and pages
│       ├── package.json
│       └── vite.config.ts
├── package.json       # Root monorepo configuration
└── README.md
```

## Packages

### SDK (`packages/sdk/`)

A TypeScript SDK that provides direct access to BitLasso API functionality:

- **API Client**: `BitLassoAPI` class for all API operations
- **Authentication**: NIP-98 and Nostr extension support
- **Wallet Operations**: Interface for wallet management
- **Type Safety**: Full TypeScript support with comprehensive types

**Key Features:**
- Get system status and settings
- Create and manage payment requests
- Purchase credits with automatic L402 authentication
- Parse Lightning invoices
- Wallet operations (mint, burn, transfer tokens)

### UI (`packages/ui/`)

The React-based web application that now uses the SDK for backend operations:

- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS + Radix UI components
- **SDK Integration**: Uses `@bitlasso/sdk` for all API calls
- **Wallet**: Integrated Breez SDK wallet functionality

### Development

#### Prerequisites

- Node.js 18+
- npm or yarn

#### Setup

```bash
# Install all dependencies
npm install

# Build SDK first
npm run build:sdk

# Start development server
npm run dev
```

#### Available Scripts

```bash
# Development
npm run dev              # Start UI dev server
npm run build:sdk        # Build SDK package
npm run build:ui         # Build UI package
npm run build            # Build both packages

# Linting
npm run lint             # Lint UI code
```

## License

BitLasso is a product of [HexQuarter](https://hexquarter.com).

The frontend source code is open source under the [MIT License](./LICENSE).  
The backend, APIs, and hosted infrastructure are proprietary and all rights are reserved by HexQuarter.

The BitLasso name and logo are trademarks of HexQuarter. See [TRADEMARK.md](./TRADEMARK.md) for usage terms.