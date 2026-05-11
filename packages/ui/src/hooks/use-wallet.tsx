import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import posthog from 'posthog-js';
import type { Seed } from '@breeztech/breez-sdk-spark/web';
import { getWallet, isPasskeyMode } from '@/lib/passkey';
import { RelayConfig, type Wallet, initializeWallet } from '@bitlasso/sdk';

export interface WalletContextType {
    storeWallet: (mnemonic: string) => Promise<Wallet>;
    wallet: Wallet | null;
    disconnect: () => void;
    walletExists: boolean;
    connectWithSeed(seed: Seed): Promise<Wallet>;
}

export type Addresses = {
    btc: string
    ln: string
    spark: string
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [walletExists, setWalletExists] = useState(() => {
        return !!localStorage.getItem('BITLASSO_MNEMONIC') || isPasskeyMode();
    })

    // Track initialization state to prevent race conditions
    const isInitialLoadRef = useRef(true);
    const connectInFlightRef = useRef(false);

    // Store the instance ref so we never re-initialize if already connected
    const walletRef = useRef<Wallet | null>(null)

    const connectWithSeed = useCallback(async (seed: Seed | string) => {
        if (typeof seed == 'string') {
            seed = { type: 'mnemonic', mnemonic: seed}
        }
        const wallet = await initializeWallet({
            seed,
            breezApiKey: import.meta.env.VITE_BREEZ_API_KEY || '',
            relayConfig: new RelayConfig({ dev: import.meta.env.DEV })
        });
        walletRef.current = wallet
        setWallet(wallet);
        return wallet
    }, [])

    const loadWallet = useCallback(async () => {
        // Guard against concurrent initialization
        if (connectInFlightRef.current) {
            return walletRef.current;
        }

        if (walletRef.current) {
            return walletRef.current
        }

        connectInFlightRef.current = true;
        try {
            if (isPasskeyMode()) {
                console.log('Passkey mode detected — awaiting authentication...')
                const passkeyWallet = await getWallet()
                setWalletExists(true)
                const wallet = await connectWithSeed(passkeyWallet.seed)
                return wallet
            }

            const mnemonic = localStorage.getItem('BITLASSO_MNEMONIC')
            if (mnemonic) {
                const wallet = await connectWithSeed(mnemonic)
                return wallet
            }
        } finally {
            connectInFlightRef.current = false;
        }
    }, [connectWithSeed])

    useEffect(() => {
        if (!isInitialLoadRef.current) return;
        isInitialLoadRef.current = false;

        loadWallet()

        const handleStorage = async () => {
            await loadWallet()
        }
        addEventListener('storage', handleStorage);

        return () => {
            removeEventListener('storage', handleStorage);
        };
    }, [loadWallet])

    const disconnect = useCallback(() => {
        console.log('disconnecting')
        posthog.capture('wallet_disconnected')
        posthog.reset()
        localStorage.removeItem('BITLASSO_MNEMONIC')
        walletRef.current = null
        setWallet(null)
        setWalletExists(false)
    }, []);

    const storeWallet = useCallback(async (mnemonic: string) => {
        localStorage.setItem('BITLASSO_MNEMONIC', mnemonic)
        walletRef.current = null
        const wallet = await loadWallet()
        if (!wallet) throw new Error("Failed to load wallet after storing mnemonic")
        setWalletExists(true)
        return wallet
    }, [loadWallet])

    return (
        <WalletContext.Provider value={{ wallet, disconnect, walletExists, storeWallet, connectWithSeed }}>
            {children}
        </WalletContext.Provider>
    )
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within WalletProvider');
    }
    return context;
}