/**
 * WebAuthn PRF Provider for passkey-based wallet operations.
 *
 * Architecture (SOLID):
 * - WebAuthnConfig: injectable RP configuration (DIP)
 * - Pure WebAuthn functions: checkPlatformAuthenticator, createPrfCredential, evaluatePrf (SRP)
 * - BrowserPasskeyPrfProvider: SDK interface + createPasskey extension (ISP)
 *
 * Each public method triggers exactly ONE WebAuthn prompt, enabling
 * the UI to show distinct wizard steps per authentication action.
 */

import { type PasskeyPrfProvider } from '@breeztech/breez-sdk-spark';

// ============================================
// Configuration
// ============================================

export interface WebAuthnConfig {
  rpName: string;
  rpId: string;
}

const defaultConfig: WebAuthnConfig = {
  rpName: import.meta.env.DEV ? 'localhost' : 'Bitlasso',
  rpId: 'keys.breez.technology',
};

// ============================================
// Pure WebAuthn Operations (SRP)
// ============================================

/**
 * Check if a user-verifying platform authenticator is available.
 * No WebAuthn prompt — purely a capability check.
 */
async function checkPlatformAuthenticator(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    return false;
  }
  return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
}

/**
 * Register a new discoverable credential with PRF enabled.
 * Triggers 1 WebAuthn prompt: navigator.credentials.create().
 *
 * @throws If the user cancels or PRF is not supported by the authenticator.
 */
async function createPrfCredential(config: WebAuthnConfig): Promise<void> {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const userId = crypto.getRandomValues(new Uint8Array(16));

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: config.rpName, id: config.rpId },
      user: { id: userId, name: config.rpName, displayName: config.rpName },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },   // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        userVerification: 'required',
        residentKey: 'required',
      },
      extensions: { prf: {} },
    },
  }) as PublicKeyCredential;

  const extResults = credential.getClientExtensionResults() as {
    prf?: { enabled?: boolean };
  };

  if (!extResults.prf?.enabled) {
    throw new Error('PRF extension not supported by this authenticator');
  }
}

/**
 * Authenticate with an existing credential and evaluate PRF with the given salt.
 * Triggers 1 WebAuthn prompt: navigator.credentials.get().
 *
 * @returns 32-byte PRF output.
 * @throws If the user cancels, no credential exists, or PRF evaluation fails.
 */
async function evaluatePrf(rpId: string, salt: string): Promise<Uint8Array> {
  const saltBytes = new TextEncoder().encode(salt);
  const challenge = crypto.getRandomValues(new Uint8Array(32));

  const credential = await navigator.credentials.get({
    publicKey: {
      challenge,
      rpId,
      allowCredentials: [],
      userVerification: 'required',
      extensions: {
        prf: { eval: { first: saltBytes } },
      },
    },
  }) as PublicKeyCredential;

  const extResults = credential.getClientExtensionResults() as {
    prf?: { results?: { first?: ArrayBuffer } };
  };

  if (!extResults.prf?.results?.first) {
    throw new Error('PRF evaluation failed');
  }

  return new Uint8Array(extResults.prf.results.first);
}

// ============================================
// Provider (ISP — SDK interface + app extension)
// ============================================

/**
 * Browser implementation of PasskeyPrfProvider using WebAuthn PRF extension.
 *
 * Implements the SDK's PasskeyPrfProvider interface (isPrfAvailable, derivePrfSeed)
 * and adds createPasskey() for explicit passkey registration.
 *
 * Uses discoverable credentials (resident keys) so no credential ID storage is needed.
 */
class BrowserPasskeyPrfProvider implements PasskeyPrfProvider {
  /** Optional callback fired after WebAuthn prompt succeeds in derivePrfSeed. */
  onAuthComplete?: () => void;

  constructor(private readonly config: WebAuthnConfig = defaultConfig) {}

  /** Check if PRF-capable passkey is available on this device. */
  async isPrfAvailable(): Promise<boolean> {
    try {
      const available = await checkPlatformAuthenticator();
      return available;
    } catch (e) {
      return false;
    }
  }

  /**
   * Create a new passkey with PRF support.
   * Only registers the credential — no seed derivation.
   * Triggers exactly 1 WebAuthn prompt.
   */
  async createPasskey(): Promise<void> {
    await createPrfCredential(this.config);
  }

  /**
   * Derive a 32-byte seed from passkey PRF with the given salt.
   * Expects a passkey to already exist (via createPasskey or previous session).
   * Triggers exactly 1 WebAuthn prompt.
   *
   * Called by the SDK for listLabels, saveLabel, and getWallet operations.
   */
  async derivePrfSeed(salt: string): Promise<Uint8Array> {
    const seed = await evaluatePrf(this.config.rpId, salt);
    this.onAuthComplete?.();
    return seed;
  }
}

// Singleton instance for production use
export const passkeyPrfProvider = new BrowserPasskeyPrfProvider();

// Export class & types for testing
export { BrowserPasskeyPrfProvider };