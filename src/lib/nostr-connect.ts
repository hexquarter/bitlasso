import { nip44, finalizeEvent, type VerifiedEvent, type EventTemplate } from "nostr-tools";
import { bytesToHex, hexToBytes } from "nostr-tools/utils";
import { getPublicKey } from "nostr-tools";
import { bech32 } from "bech32";
import { mnemonicToSeedSync } from "@scure/bip39";
import { HDKey } from "@scure/bip32";

export type NostrConnection = {
    pubkey: string;
    npub: string;
    sign: (event: EventTemplate) => Promise<VerifiedEvent>;
    getConversationKey: (theirPubkey: string) => Uint8Array;
}

export const isNostrExtensionAvailable = (): boolean => {
    return typeof window !== 'undefined' && !!(window as any).nostr;
}

export const connectViaExtension = async (): Promise<NostrConnection> => {
    const nostr = (window as any).nostr;
    if (!nostr) {
        throw new Error('No Nostr extension found. Please install Alby or nos2x');
    }

    try {
        const pubkey = await nostr.getPublicKey();
        const pkBytes = hexToBytes(pubkey);
        const npub = bech32.encode('npub', bech32.toWords(pkBytes));

        return {
            pubkey,
            npub,
            sign: async (event: EventTemplate) => {
                const signed = await nostr.signEvent(event);
                return signed as VerifiedEvent;
            },
            getConversationKey: (theirPubkey: string) => {
                return nip44.getConversationKey(hexToBytes(pubkey), theirPubkey);
            },
        };
    } catch (error) {
        throw new Error(`Extension connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const decodeNsec = (nsec: string): string => {
    try {
        const decoded = bech32.decode(nsec);
        if (decoded.prefix !== 'nsec') {
            throw new Error('Invalid nsec format');
        }
        const bytes = bech32.fromWords(decoded.words);
        return bytesToHex(new Uint8Array(bytes));
    } catch (error) {
        throw new Error(`Invalid nsec: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const connectViaNsec = (nsecOrHex: string): NostrConnection => {
    let privateKeyHex: string;

    if (nsecOrHex.startsWith('nsec1')) {
        privateKeyHex = decodeNsec(nsecOrHex);
    } else if (/^[a-f0-9]{64}$/i.test(nsecOrHex)) {
        privateKeyHex = nsecOrHex;
    } else {
        throw new Error('Invalid nsec or hex private key');
    }

    const privateKeyBytes = hexToBytes(privateKeyHex);
    const pubkey = getPublicKey(privateKeyBytes);
    const pkBytes = hexToBytes(pubkey);
    const npub = bech32.encode('npub', bech32.toWords(pkBytes));

    return {
        pubkey,
        npub,
        sign: async (event: EventTemplate) => {
            return finalizeEvent(event, privateKeyBytes);
        },
        getConversationKey: (theirPubkey: string) => {
            return nip44.getConversationKey(privateKeyBytes, theirPubkey);
        },
    };
}

export const deriveNsec = (mnemonic: string | Uint8Array): string => {
    let seed: Uint8Array | undefined = undefined
    if (mnemonic instanceof Uint8Array) {
        seed = mnemonic
    }
    else {
        seed = mnemonicToSeedSync(mnemonic)
    }
    const hdkey = HDKey.fromMasterSeed(seed);
    const privateKey = hdkey.derive("m/44'/1237'/0'/0/0").privateKey;
    if (!privateKey) {
        throw new Error('Cannot derive Nostr private key')
    }
    const nsec = bech32.encode('nsec', bech32.toWords(privateKey));
    return nsec
}

export const encryptPassphrase = (passphrase: string, nostrConnection: NostrConnection): string => {
    const conversationKey = nostrConnection.getConversationKey(nostrConnection.pubkey);
    return nip44.encrypt(passphrase, conversationKey);
}

export const decryptPassphrase = (encryptedPassphrase: string, nostrConnection: NostrConnection): string => {
    const conversationKey = nostrConnection.getConversationKey(nostrConnection.pubkey);
    return nip44.decrypt(encryptedPassphrase, conversationKey);
}