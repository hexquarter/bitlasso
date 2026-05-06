# BitLasso SDK

A TypeScript SDK for integrating Bitcoin and Spark payments directly into your applications, bypassing the Bitlasso UI.

## Features

- 🚀 **Direct API Access**: Interact with Bitlasso APIs without the web interface
- 💰 **Payment Operations**: Create payment requests, process payments, manage credits
- 🏦 **Wallet Operations**: Full wallet functionality including token minting, transfers, and balance management
- 🔐 **Authentication**: Support for Nostr extension and NSEC-based authentication
- 📝 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🛡️ **Error Handling**: Robust error handling with custom SDK error types

## Installation

```bash
npm install @bitlasso/sdk
```

## Quick Start

### Wallet Operations

```typescript
import { initializeWallet } from '@bitlasso/sdk';

// Note: Wallet initialization requires full Breez SDK setup
// This is a simplified example - actual implementation requires
// proper wallet initialization with seeds/API keys

const wallet = await initializeWallet({
  seed: { type: 'mnemonic', seed: ''},
  breezApiKey: 'your-api-key'
});

// Get wallet addresses
const sparkAddress = await wallet.getSparkAddress();
const bitcoinAddress = await wallet.getBitcoinAddress();

// Check balance
const balance = await wallet.getBalance();
console.log('BTC Balance:', balance.balance);
console.log('Token balances:', balance.tokenBalances);

// Send a payment
const payment = await wallet.sendSparkPayment('spark:recipient', 1000);
console.log('Payment sent:', payment.paymentId);
```

### API Client

```typescript
import { Client } from '@bitlasso/sdk';

// Initialize the API client
const api = new Client({
  dev: false // Set to true for localhost development
});

// Get system status
const status = await api.getStatus();
console.log('Spark Status:', status.sparkStatus);

// Get settings
const settings = await api.getSettings();
console.log('Available bundles:', settings.bundles);
```

### Authentication & Payment Requests

```typescript
import { initializeWallet, Client } from '@bitlasso/sdk';

// Note: Wallet initialization requires full Breez SDK setup
// This is a simplified example - actual implementation requires
// proper wallet initialization with seeds/API keys

const wallet = await initializeWallet({
  seed: { type: 'mnemonic', seed: ''},
  breezApiKey: 'your-api-key'
});

// Create API client
const api = new Client();

// Create a payment request
const paymentRequest = {
  items: [
    { title: 'Product A', description: 'Great product', amount: 50 },
    { title: 'Product B', description: 'Another product', amount: 50 }
  ],
  discountRate: 0
};

// Publish payment request
const result = await api.publishPaymentRequest(wallet, paymentRequest);
console.log('Payment request created:', result.id);
```

## Development

### Building

```bash
cd packages/sdk
yarn
yarn run build
```

## Requirements

- Node.js 16+
- TypeScript 4.5+
- For wallet operations: Breez SDK and Spark SDK (peer dependencies)

## License

MIT

## Contributing

Contributions welcome! Please see the main repository for contribution guidelines.