
/**
 * Convert an Uint8Array into a number
 * @param data Uint8Array
 * @returns number
 */
export const uint8ArrayToNum = (data: Uint8Array) => data.reduce((acc, byte) => (acc << 8n) | BigInt(byte), 0n);

/**
   * Parses the amount from a Lightning invoice
   * @param invoice - BOLT11 Lightning invoice
   * @returns Amount in BTC or undefined if parsing fails
   */
export const parseLightningInvoiceAmount = (invoice: string): number | undefined => {
    // Parse BOLT11 invoice to extract amount in BTC
    // Format: lnbc<amount><multiplier>...
    // Multipliers: m=milli, u=micro, n=nano, p=pico (default: satoshis)
    try {
        const match = invoice.match(/^lnbc(\d+)([munp]?)/);
        if (!match) return undefined;

        const amount = parseInt(match[1], 10);
        const sats = match[2] === 'm' ? amount * 100_000 :
            match[2] === 'u' ? amount * 100 :
                match[2] === 'n' ? amount / 10 :
                    match[2] === 'p' ? amount / 100 :
                        amount / 100_000_000;
        return sats / 100_000_000;
    } catch (error) {
        console.error('Failed to parse lightning invoice amount:', error);
        return undefined;
    }
}