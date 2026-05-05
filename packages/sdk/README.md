# BitLasso SDK

A TypeScript SDK for integrating Bitcoin and Spark payments directly into your applications, bypassing the BitLasso UI.

## Features

- 🚀 **Direct API Access**: Interact with BitLasso APIs without the web interface
- 💰 **Payment Operations**: Create payment requests, process payments, manage credits
- 🏦 **Wallet Operations**: Full wallet functionality including token minting, transfers, and balance management
- 🔐 **Authentication**: Support for Nostr extension and NSEC-based authentication
- 📝 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🛡️ **Error Handling**: Robust error handling with custom SDK error types

## Installation

```bash
npm install bitlasso-sdk
```

## Quick Start

### Wallet Operations

```typescript
import { initializeWallet } from 'bitlasso-sdk';

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
import { Client } from 'bitlasso-sdk';

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
import { BitLassoWallet, createAuth, BitLassoAPI } from 'bitlasso-sdk';

// Note: Wallet initialization requires full Breez SDK setup
// This is a simplified example - actual implementation requires
// proper wallet initialization with seeds/API keys

const wallet = await BitLassoWallet.initialize({
  seed: { type: 'mnemonic', seed: ''},
  breezApiKey: 'your-api-key'
});

// Setup Nostr authentication
const auth = createAuth(wallet.nostrConnection);

// Create API client
const api = new BitLassoAPI();

// Create a payment request
const paymentRequest = {
  amount: 100,
  items: [
    { title: 'Product A', description: 'Great product', amount: 50 },
    { title: 'Product B', description: 'Another product', amount: 50 }
  ],
  discountRate: 0
};

// Generate auth token
const token = await auth.createPaymentRequestToken(paymentRequest, api);

// Publish payment request
const result = await api.publishPaymentRequest(paymentRequest, token);
console.log('Payment request created:', result.id);
```

## API Reference

### BitLassoAPI

Main API client for interacting with BitLasso services.

#### Constructor

```typescript
new BitLassoAPI(config?: SDKConfig)
```

#### Methods

- `getStatus()`: Get system status
- `getSettings()`: Get system settings and bundles
- `getPaymentPrice(paymentRequestId)`: Get current price for a payment request
- `purchaseCredits(bundleId, receiverAddress, wallet?)`: Purchase credits
- `publishPaymentRequest(paymentRequest, authToken, wallet?, tokenBalances?)`: Create payment request

### BitLassoAuth

Authentication utilities for generating tokens.

#### Methods

- `generateNIP98Token(url, method, body?)`: Generate NIP-98 auth token
- `createPaymentRequestToken(paymentRequest, api)`: Create payment request token

### BitLassoWallet

Wallet operations interface.

#### Static Methods

- `BitLassoWallet.initialize(auth)`: Initialize wallet

#### Instance Methods

- `getSparkAddress()`: Get Spark address
- `getBitcoinAddress()`: Get Bitcoin address
- `getLightningAddress()`: Get Lightning address
- `getBalance()`: Get wallet balance
- `sendSparkPayment(address, amount?)`: Send Spark payment
- `sendLightningPayment(invoice, amount?)`: Send Lightning payment
- `sendOnChainPayment(address, amount)`: Send Bitcoin payment
- `sendTokenTransfer(tokenId, amount, recipient)`: Send token transfer
- `mintTokens(amount)`: Mint new tokens
- `burnTokens(amount, tokenId?)`: Burn tokens
- `createToken(name, symbol, supply, decimals, freezable)`: Create new token
- `listPayments()`: List payment history
- `fetchPrices()`: Get current prices

## Types

### SDKConfig

```typescript
interface SDKConfig {
  apiUrl?: string;    // Custom API URL
  dev?: boolean;      // Use localhost API
}
```

### AuthConfig

```typescript
interface AuthConfig {
  seed: { type: 'mnemonic', seed: string} | { type: 'entropy' & number[]};
  breezApiKey: string;     // Required API key
}
```

### PaymentRequest

```typescript
interface PaymentRequest {
  amount: number;
  items: PaymentItem[];
  discountRate: number;
}
```

### Wallet Operations

See the `WalletOperations` interface for complete wallet method signatures.

## Error Handling

The SDK uses custom `SDKError` class for all errors:

```typescript
try {
  const result = await api.getStatus();
} catch (error) {
  if (error instanceof SDKError) {
    console.error('SDK Error:', error.code, error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Development

### Building

```bash
cd sdk
npm install
npm run build
```

### Testing

```bash
npm test
```

## Requirements

- Node.js 16+
- TypeScript 4.5+
- For wallet operations: Breez SDK and Spark SDK (peer dependencies)

## License

MIT

## Contributing

Contributions welcome! Please see the main repository for contribution guidelines.