/**
 * Wallet operations for BitLasso SDK
 *
 * This module provides a simplified interface to wallet operations,
 * abstracting away the complexity of the underlying Breez SDK.
 */

import initBreezSDK, { BreezSdk, SdkBuilder, type PrepareLnurlPayResponse, type PrepareSendPaymentResponse, type SdkEvent, type Rate, type Payment, type TokenBalance, defaultConfig } from "@breeztech/breez-sdk-spark";
import { SparkReadonlyClient } from "@buildonspark/spark-sdk";

export { type Payment as BreezPayment } from "@breeztech/breez-sdk-spark"

import type {
    WalletOperations,
    Balance,
    SparkPayment,
    Deposit,
    PriceRate,
    TokenMetadata,
    TokenStats,
    AuthConfig,
    TokenBalanceMap,
    BreezEvent
} from './types.js';
import { SDKError } from './types.js';
import { connectViaNsec, deriveNsec, fetchSettings, registerSettings, RelayConfig, type NostrConnection } from "./nostr.js";
import { uint8ArrayToNum } from "./utils.js";
import { bytesToHex } from "nostr-tools/utils";

export const BURN_PUBLIC_KEY =
    "020202020202020202020202020202020202020202020202020202020202020202";

type EventMap = Record<string, any>;
export class TypedEventEmitter<Events extends EventMap> {
    private events = new Map<keyof Events, Array<Events[keyof Events]>>();

    on<K extends keyof Events>(event: K, listener: Events[K]): this {
        const listeners = this.events.get(event) || [];
        listeners.push(listener);
        this.events.set(event, listeners);
        return this;
    }

    off<K extends keyof Events>(event: K, listener: Events[K]): this {
        const listeners = this.events.get(event);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
                if (listeners.length === 0) {
                    this.events.delete(event);
                } else {
                    this.events.set(event, listeners);
                }
            }
        }
        return this;
    }

    emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): boolean {
        const listeners = this.events.get(event);
        console.log(`[emit] ${String(event)} → ${listeners?.length ?? 0} listeners`)
        if (listeners) {
            listeners.forEach((listener) => listener(...args));
            return true;
        }
        return false;
    }
}

export type Wallet = WalletOperations & TypedEventEmitter<BreezEvent>

/**
     * Initializes a new wallet with the given authentication
     * @param auth - Authentication configuration
     * @returns Wallet instance
     * @throws {SDKError} If initialization fails
     */
export const initializeWallet = async (auth: AuthConfig, _nostrConnection?: NostrConnection): Promise<BitlassoWallet> => {
    // Initialise the WebAssembly module
    await initBreezSDK();

    try {
        const config = defaultConfig('mainnet')
        config.apiKey = auth.breezApiKey
        config.maxDepositClaimFee = { type: 'networkRecommended', leewaySatPerVbyte: 1 }

        let builder = SdkBuilder.new(config, auth.seed)
        builder = await builder.withDefaultStorage('./bitlasso')
        builder = builder.withKeySet({
            keySetType: 'default',
            useAddressIndex: false,
            accountNumber: 1
        })
        const sdk = await builder.build()
        await sdk.updateUserSettings({
            sparkPrivateModeEnabled: false
        })

        let nostrConnection: NostrConnection
        if (!_nostrConnection) {
            const nsec = deriveNsec(auth.seed.type == 'mnemonic' ? auth.seed.mnemonic : new Uint8Array(auth.seed))
            const connection = connectViaNsec(nsec)
            nostrConnection = connection
        } else {
            nostrConnection = _nostrConnection
        }

        const info = await sdk.getInfo({})
        const instance = new BitlassoWallet(sdk, nostrConnection, info.identityPubkey)

        class JsEventListener {
            private deliveredEvents = new Set<string>(); // track delivered events
            private readonly MAX_EVENTS = 100

            private trackEvent(key: string): boolean {
                if (this.deliveredEvents.has(key)) return false

                // Evict oldest entry if at cap
                if (this.deliveredEvents.size >= this.MAX_EVENTS) {
                    const oldest = this.deliveredEvents.values().next().value
                    if (oldest) {
                        this.deliveredEvents.delete(oldest)
                    }
                }

                this.deliveredEvents.add(key)
                return true
            }


            onEvent = async (event: SdkEvent) => {
                console.log(event)
                switch (event.type) {
                    case 'synced': {
                        // Data has been synchronized with the network. When this event is received,
                        // it is recommended to refresh the payment list and wallet balance.
                        instance.emit('synced')
                        break
                    }
                    case 'unclaimedDeposits': {
                        // SDK was unable to claim some deposits automatically
                        const unclaimedDeposits = event.unclaimedDeposits
                        instance.emit('unclaimedDeposits', unclaimedDeposits)
                        break
                    }
                    case 'claimedDeposits': {
                        // Deposits were successfully claimed
                        const claimedDeposits = event.claimedDeposits
                        instance.emit('claimedDeposits', claimedDeposits)
                        break
                    }
                    case 'paymentSucceeded': {
                        // A payment completed successfully
                        const payment = event.payment
                        if (!this.trackEvent(`${payment.paymentType}:${payment.id}`)) return

                        if (payment.paymentType == 'receive') {
                            instance.emit('paymentReceived', payment)
                        }
                        else {
                            instance.emit('paymentSent', payment)
                        }
                        break
                    }
                    case 'paymentPending': {
                        // A payment is pending (waiting for confirmation)
                        const pendingPayment = event.payment
                        if (!this.trackEvent(`pending:${pendingPayment.id}`)) return

                        instance.emit('paymentPending', pendingPayment)
                        break
                    }
                    case 'paymentFailed': {
                        // A payment failed
                        const failedPayment = event.payment
                        if (!this.trackEvent(`failed:${failedPayment.id}`)) return

                        instance.emit('paymentFailed', failedPayment)
                        break
                    }
                    default: {
                        // Handle any future event types
                        break
                    }
                }
            }
        }

        instance.listenerId = await sdk.addEventListener(new JsEventListener())

        try {
            const unclaimedDeposits = await sdk.listUnclaimedDeposits({})
            await Promise.all(unclaimedDeposits.deposits.map(async (d) => {
                try {
                    await sdk.claimDeposit({ txid: d.txid, vout: d.vout })
                } catch (e: any) {
                    if (e.message?.includes('below dust limit')) {
                        console.info(`Deposit ${d.txid}:${d.vout} is below dust limit, skipping claim for now.`)
                    } else {
                        console.error(`Failed to claim deposit ${d.txid}:${d.vout}`, e)
                    }
                }
            }))
        }
        catch (e) {
            console.error('failed to process unclaimed deposits', e)
        }

        if (!auth.relayConfig) {
            auth.relayConfig = new RelayConfig()
        }

        let settings = await fetchSettings(auth.relayConfig, instance)
        if (!settings) {
            await registerSettings(auth.relayConfig, instance, {
                sparkIdentityKey: instance.identityPubkey
            })
        }
        else if (!settings.sparkIdentityKey) {
            settings.sparkIdentityKey = instance.identityPubkey
            await registerSettings(auth.relayConfig, instance, settings)
        }

        return instance;
    } catch (error) {
        if (error instanceof SDKError) throw error;
        throw new SDKError(
            `Failed to initialize wallet: ${error instanceof Error ? error.message : String(error)}`,
            'WALLET_INIT_FAILED'
        );
    }
}

/**
 * Wallet class that implements wallet operations
 */
class BitlassoWallet extends TypedEventEmitter<BreezEvent> implements WalletOperations {
    private wallet: BreezSdk; // Internal wallet instance
    public nostrConnection: NostrConnection
    public identityPubkey: string
    public listenerId: string | undefined

    /**
     * Creates a new wallet instance
     * @param wallet - Internal wallet implementation
     */
    constructor(wallet: BreezSdk, nostrConnection: NostrConnection, identityPubkey: string) {
        super()
        this.wallet = wallet;
        this.nostrConnection = nostrConnection;
        this.identityPubkey = identityPubkey
    }

    /**
     * Gets the Spark address for the wallet
     * @returns Spark address
     */
    async getSparkAddress(): Promise<string> {
        try {
            const res = await this.wallet.receivePayment({
                paymentMethod: {
                    type: 'sparkAddress'
                }
            })
            return res.paymentRequest
        } catch (error) {
            throw new SDKError(
                `Failed to get Spark address: ${error instanceof Error ? error.message : String(error)}`,
                'GET_SPARK_ADDRESS_FAILED'
            );
        }
    }

    /**
     * Gets the Bitcoin address for the wallet
     * @returns Bitcoin address
     */
    async getBitcoinAddress(): Promise<string> {
        try {
            const res = await this.wallet.receivePayment({
                paymentMethod: {
                    type: 'bitcoinAddress'
                }
            })
            return res.paymentRequest
        } catch (error) {
            throw new SDKError(
                `Failed to get Bitcoin address: ${error instanceof Error ? error.message : String(error)}`,
                'GET_BITCOIN_ADDRESS_FAILED'
            );
        }
    }

    /**
     * Gets the Lightning address for the wallet
     * @returns Lightning address
     */
    async getLightningAddress(): Promise<string> {
        try {
            const nostrPubKey = this.nostrConnection.npub
            const isAvailable = await this.wallet.checkLightningAddressAvailable({
                username: nostrPubKey
            })
            if (isAvailable) {
                const info = await this.wallet.registerLightningAddress({ username: nostrPubKey })
                return info.lightningAddress
            }
            else {
                let info = await this.wallet.getLightningAddress()
                if (info) {
                    return info.lightningAddress
                }

                info = await this.wallet.registerLightningAddress({ username: nostrPubKey })
                return info.lightningAddress
            }
        } catch (error) {
            throw new SDKError(
                `Failed to get Lightning address: ${error instanceof Error ? error.message : String(error)}`,
                'GET_LIGHTNING_ADDRESS_FAILED'
            );
        }
    }

    /**
     * Mints new tokens
     * @param amount - Amount of tokens to mint
     * @returns Mint transaction details
     */
    async mintTokens(amount: bigint): Promise<{ id: string; timestamp: Date }> {
        try {
            const tokenIssuer = this.wallet.getTokenIssuer()
            const payment = await tokenIssuer.mintIssuerToken({ amount })
            const paymentDetails = payment.details as { type: 'token'; txHash: string };
            return { id: paymentDetails.txHash, timestamp: new Date(payment.timestamp * 1000) };
        } catch (error) {
            throw new SDKError(
                `Failed to mint tokens: ${error instanceof Error ? error.message : String(error)}`,
                'MINT_TOKENS_FAILED'
            );
        }
    }

    /**
     * Burns tokens
     * @param amount - Amount of tokens to burn
     * @param tokenIdentifier - Optional token identifier
     * @returns Burn transaction details
     */
    async burnTokens(amount: bigint, tokenIdentifier?: string): Promise<{ id: string; timestamp: Date }> {
        try {
            if (tokenIdentifier) {
                // Burn address
                const { paymentId } = await this.sendTokenTransfer(tokenIdentifier, amount, 'spark1pgssyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszykl0d2')
                return { id: paymentId, timestamp: new Date() }
            }
            const tokenIssuer = this.wallet.getTokenIssuer()
            const payment = await tokenIssuer.burnIssuerToken({ amount })
            return { id: payment.id, timestamp: new Date(payment.timestamp * 1000) };
        } catch (error) {
            throw new SDKError(
                `Failed to burn tokens: ${error instanceof Error ? error.message : String(error)}`,
                'BURN_TOKENS_FAILED'
            );
        }
    }

    /**
     * Gets token metadata
     * @param identifier - Optional token identifier
     * @returns Token metadata or undefined
     */
    async getTokenMetadata(identifier?: string): Promise<TokenMetadata | undefined> {
        try {
            if (identifier) {
                const res = await this.wallet.getTokensMetadata({
                    tokenIdentifiers: [identifier]
                })
                if (res.tokensMetadata.length > 0) {
                    return {
                        identifier: identifier,
                        name: res.tokensMetadata[0].name,
                        symbol: res.tokensMetadata[0].name,
                        maxSupply: BigInt(res.tokensMetadata[0].maxSupply),
                        decimals: res.tokensMetadata[0].decimals,
                    }
                }
                return undefined
            }

            const tokenIssuer = this.wallet.getTokenIssuer()
            const metadata = await tokenIssuer.getIssuerTokenMetadata()
            return {
                identifier: metadata.identifier,
                name: metadata.name,
                symbol: metadata.ticker,
                maxSupply: BigInt(metadata.maxSupply),
                decimals: metadata.decimals
            }
        } catch (error) {
            throw new SDKError(
                `Failed to get token metadata: ${error instanceof Error ? error.message : String(error)}`,
                'GET_TOKEN_METADATA_FAILED'
            );
        }
    }

    /**
     * Gets token statistics
     * @param tokenMetadata - Token metadata
     * @returns Token statistics or undefined
     */
    async getTokenStats(tokenMetadata: TokenMetadata): Promise<TokenStats | undefined> {
        try {
            const client = SparkReadonlyClient.createPublic({
                network: "MAINNET",
            })


            const all = [];

            let cursor: string | undefined;

            do {
                const page = await client.getTokenTransactions({
                    tokenIdentifiers: [tokenMetadata.identifier],
                    pageSize: 50,
                    cursor,
                    direction: "NEXT",
                })

                all.push(...page.transactions);
                cursor = page.pageResponse?.nextCursor;
            } while (cursor);

            const res = all.reduce((acc, t) => {
                if (t.tokenTransaction?.tokenInputs?.$case == 'mintInput') {
                    const amount = uint8ArrayToNum(t.tokenTransaction.tokenOutputs[0].tokenAmount)
                    acc.mint += Number(amount) / (10 ** tokenMetadata.decimals)
                }
                if (t.tokenTransaction?.tokenInputs?.$case == 'transferInput') {
                    const amount = uint8ArrayToNum(t.tokenTransaction.tokenOutputs[0].tokenAmount)
                    if (bytesToHex(t.tokenTransaction.tokenOutputs[0].ownerPublicKey) == BURN_PUBLIC_KEY) {
                        acc.burn += Number(amount) / (10 ** tokenMetadata.decimals)
                    }
                    acc.transfers += Number(amount) / (10 ** tokenMetadata.decimals)
                }
                return acc
            }, { burn: 0, mint: 0, transfers: 0 } as { burn: number, mint: number, transfers: number })

            return {
                burns: res.burn,
                mints: res.mint,
                transfers: res.transfers,
                circulating: res.mint - res.burn
            }
        } catch (error) {
            throw new SDKError(
                `Failed to get token stats: ${error instanceof Error ? error.message : String(error)}`,
                'GET_TOKEN_STATS_FAILED'
            );
        }
    }

    /**
     * Creates a new token
     * @param name - Token name
     * @param symbol - Token symbol
     * @param initialSupply - Initial supply
     * @param decimals - Decimal places
     * @param isFreezable - Whether token is freezable
     * @returns Token creation details
     */
    async createToken(
        name: string,
        symbol: string,
        initialSupply: bigint,
        decimals: number,
        isFreezable: boolean
    ): Promise<{ tokenId: string }> {
        try {
            const tokenIssuer = this.wallet.getTokenIssuer()
            const response = await tokenIssuer.createIssuerToken({
                name: name,
                ticker: symbol,
                decimals: decimals,
                isFreezable: isFreezable,
                maxSupply: initialSupply
            })

            return { tokenId: response.identifier };
        } catch (error) {
            throw new SDKError(
                `Failed to create token: ${error instanceof Error ? error.message : String(error)}`,
                'CREATE_TOKEN_FAILED'
            );
        }
    }

    /**
     * Gets the wallet balance
     * @returns Balance information
     */
    async getBalance(): Promise<Balance> {
        try {
            const info = await this.wallet.getInfo({})

            const tokenBalances = new Map() as TokenBalanceMap
            info.tokenBalances.forEach((tb: TokenBalance, id: string) => {
                tokenBalances.set(id, {
                    balance: BigInt(tb.balance),
                    tokenMetadata: {
                        identifier: id,
                        name: tb.tokenMetadata.name,
                        symbol: tb.tokenMetadata.ticker,
                        maxSupply: BigInt(tb.tokenMetadata.maxSupply),
                        decimals: tb.tokenMetadata.decimals
                    }
                })
            })

            return {
                balance: BigInt(info.balanceSats),
                tokenBalances: tokenBalances
            }
        } catch (error) {
            throw new SDKError(
                `Failed to get balance: ${error instanceof Error ? error.message : String(error)}`,
                'GET_BALANCE_FAILED'
            );
        }
    }

    /**
     * Sends a Spark payment
     * @param address - Recipient address
     * @param amountSats - Amount in satoshis
     * @returns Payment details
     */
    async sendSparkPayment(address: string, amountSats: number): Promise<{ paymentId: string }> {
        try {
            const prepareResponse = await this.wallet.prepareSendPayment({
                paymentRequest: address,
                amount: BigInt(amountSats)
            })

            const sendResponse = await this.wallet.sendPayment({
                prepareResponse
            })

            const payment = sendResponse.payment
            return { paymentId: payment.id };
        } catch (error) {
            throw new SDKError(
                `Failed to send Spark payment: ${error instanceof Error ? error.message : String(error)}`,
                'SEND_SPARK_PAYMENT_FAILED'
            );
        }
    }

    /**
     * Sends a Lightning payment
     * @param invoice - Lightning invoice
     * @param amountSats - Amount in satoshis
     * @returns Payment details
     */
    async sendLightningPayment(invoice: string, amountSats?: number): Promise<{ paymentId: string }> {
        try {
            const response = await this.prepareLightningPayment(invoice, amountSats)
            if ('payRequest' in response) {
                const res = await this.wallet.lnurlPay({
                    prepareResponse: response as PrepareLnurlPayResponse
                })
                return { paymentId: res.payment.id };
            } else {
                const paymentResponse = response as PrepareSendPaymentResponse
                const res = await this.wallet.sendPayment({
                    prepareResponse: paymentResponse
                })
                return { paymentId: res.payment.id };
            }
        } catch (error) {
            throw new SDKError(
                `Failed to send Lightning payment: ${error instanceof Error ? error.message : String(error)}`,
                'SEND_LIGHTNING_PAYMENT_FAILED'
            );
        }
    }
    private async prepareLightningPayment(invoice: string, amountSats?: number): Promise<PrepareSendPaymentResponse | PrepareLnurlPayResponse> {
        const parsedInvoice = await this.wallet.parse(invoice)
        switch (parsedInvoice.type) {
            case 'bolt11Invoice':
                if (parsedInvoice.amountMsat === undefined && amountSats === undefined) {
                    throw new Error('Amount must be specified for invoices without an amount')
                }

                const prepareResponse = await this.wallet.prepareSendPayment({
                    paymentRequest: invoice,
                    amount: amountSats ? BigInt(amountSats) : undefined
                })

                return prepareResponse
            case 'bolt12Invoice':
                const prepareBolt12Response = await this.wallet.prepareSendPayment({
                    paymentRequest: invoice,
                    amount: amountSats ? BigInt(amountSats) : undefined
                })
                return prepareBolt12Response
            case 'lightningAddress':
                if (amountSats === undefined) {
                    throw new Error('Amount must be specified for Lightning Address payments')
                }

                if (parsedInvoice.payRequest.minSendable !== undefined && amountSats < parsedInvoice.payRequest.minSendable) {
                    throw new Error(`Amount is below the minimum amount of ${parsedInvoice.payRequest.minSendable} sats`)
                }
                if (parsedInvoice.payRequest.maxSendable !== undefined && amountSats > parsedInvoice.payRequest.maxSendable) {
                    throw new Error(`Amount is above the maximum amount of ${parsedInvoice.payRequest.maxSendable} sats`)
                }

                const prepareResponseLnAddress = await this.wallet.prepareLnurlPay({
                    amount: BigInt(amountSats),
                    payRequest: parsedInvoice.payRequest
                })

                return prepareResponseLnAddress
            case 'lnurlPay':
                // LNURL pay requests may have a min and max amount, but we still require an amount to be specified
                if (amountSats === undefined) {
                    throw new Error('Amount must be specified for LNURL pay requests')
                }

                if (parsedInvoice.minSendable !== undefined && amountSats < parsedInvoice.minSendable) {
                    throw new Error(`Amount is below the minimum amount of ${parsedInvoice.minSendable} sats`)
                }
                if (parsedInvoice.maxSendable !== undefined && amountSats > parsedInvoice.maxSendable) {
                    throw new Error(`Amount is above the maximum amount of ${parsedInvoice.maxSendable} sats`)
                }

                const prepareResponseLnPay = await this.wallet.prepareLnurlPay({
                    amount: BigInt(amountSats),
                    payRequest: parsedInvoice
                })

                return prepareResponseLnPay
            default:
                throw new Error('Unsupported invoice type')
        }
    }


    /**
     * Sends an on-chain Bitcoin payment
     * @param address - Bitcoin address
     * @param amountSats - Amount in satoshis
     * @returns Payment details
     */
    async sendOnChainPayment(address: string, amountSats: number): Promise<{ paymentId: string }> {
        try {
            const prepareResponse = await this.wallet.prepareSendPayment({
                paymentRequest: address,
                amount: BigInt(amountSats)
            })

            const sendResponse = await this.wallet.sendPayment({
                prepareResponse,
                options: {
                    type: 'bitcoinAddress',
                    confirmationSpeed: 'medium'
                },
            })
            const payment = sendResponse.payment
            return { paymentId: payment.id }
        } catch (error) {
            throw new SDKError(
                `Failed to send on-chain payment: ${error instanceof Error ? error.message : String(error)}`,
                'SEND_ON_CHAIN_PAYMENT_FAILED'
            );
        }
    }

    /**
     * Sends a token transfer
     * @param tokenIdentifier - Token identifier
     * @param amount - Amount to transfer
     * @param recipient - Recipient address
     * @returns Payment details
     */
    async sendTokenTransfer(
        tokenIdentifier: string,
        amount: bigint,
        recipient: string
    ): Promise<{ paymentId: string }> {
        try {
            const prepareResponse = await this.wallet.prepareSendPayment({
                paymentRequest: recipient,
                amount: BigInt(amount),
                tokenIdentifier
            })

            const sendResponse = await this.wallet.sendPayment({
                prepareResponse
            })
            const payment = sendResponse.payment
            if (payment.details?.type != 'token') {
                throw new Error('Expected token transfer')
            }
            return { paymentId: payment.details.txHash };
        } catch (error) {
            throw new SDKError(
                `Failed to send token transfer: ${error instanceof Error ? error.message : String(error)}`,
                'SEND_TOKEN_TRANSFER_FAILED'
            );
        }
    }

    /**
     * Gets the transfer fee for a payment type
     * @param type - Payment type
     * @param address - Recipient address
     * @param amountSats - Amount in satoshis
     * @param tokenIdentifier - Token identifier (for token transfers)
     * @returns Fee amount
     */
    async getTransferFee(
        type: 'spark' | 'bitcoin' | 'token' | 'lightning',
        address: string,
        amountSats?: number,
        tokenIdentifier?: string
    ): Promise<number> {
        try {
            switch (type) {
                case 'spark': {
                    const prepareResponse = await this.wallet.prepareSendPayment({
                        paymentRequest: address,
                        amount: amountSats ? BigInt(amountSats) : undefined
                    })

                    if (prepareResponse.paymentMethod.type == 'sparkAddress') {
                        return Number(prepareResponse.paymentMethod.fee);
                    }

                    return 0;
                }
                case 'bitcoin': {
                    const prepareResponse = await this.wallet.prepareSendPayment({
                        paymentRequest: address,
                        amount: amountSats ? BigInt(amountSats) : undefined
                    })

                    if (prepareResponse.paymentMethod.type == 'bitcoinAddress') {
                        const feeQuote = prepareResponse.paymentMethod.feeQuote.speedMedium;
                        return feeQuote.userFeeSat + feeQuote.l1BroadcastFeeSat;
                    }

                    return 0;
                }
                case 'token': {
                    const prepareResponse = await this.wallet.prepareSendPayment({
                        paymentRequest: address,
                        amount: amountSats ? BigInt(amountSats) : undefined,
                        tokenIdentifier: tokenIdentifier
                    })

                    if (prepareResponse.paymentMethod.type == 'sparkAddress') {
                        return Number(prepareResponse.paymentMethod.fee);
                    }

                    return 0;
                }
                case 'lightning': {
                    const prepareResponse = await this.prepareLightningPayment(address, amountSats)
                    if ('payRequest' in prepareResponse) {
                        return prepareResponse.feeSats;
                    }
                    else if (prepareResponse.paymentMethod.type == 'bolt11Invoice') {
                        const lnFees = prepareResponse.paymentMethod.lightningFeeSats;
                        if (prepareResponse.paymentMethod.sparkTransferFeeSats) {
                            return lnFees + prepareResponse.paymentMethod.sparkTransferFeeSats;
                        }
                        return lnFees;
                    }
                    return 0;
                }
                default:
                    return 0;
            }
        } catch (error) {
            throw new SDKError(
                `Failed to get transfer fee: ${error instanceof Error ? error.message : String(error)}`,
                'GET_TRANSFER_FEE_FAILED'
            );
        }
    }

    /**
     * Lists all payments
     * @returns Array of payments
     */
    async listPayments(): Promise<SparkPayment[]> {
        try {
            const response = await this.wallet.listPayments({})
            return response.payments.map((p: Payment) => {
                return {
                    id: p.id,
                    amount: p.amount,
                    timestamp: p.timestamp,
                    method: p.method as "lightning" | "spark" | "token" | "deposit" | "withdraw",
                    direction: p.paymentType == 'send' ? 'OUTGOING' : 'INCOMING'
                }
            })
        } catch (error) {
            throw new SDKError(
                `Failed to list payments: ${error instanceof Error ? error.message : String(error)}`,
                'LIST_PAYMENTS_FAILED'
            );
        }
    }

    /**
     * Lists unclaimed deposits
     * @returns Array of deposits
     */
    async listUnclaimDeposits(): Promise<Deposit[]> {
        try {
            const unclaimDeposits = await this.wallet.listUnclaimedDeposits({})
            return unclaimDeposits.deposits as Deposit[]
        } catch (error) {
            throw new SDKError(
                `Failed to list unclaimed deposits: ${error instanceof Error ? error.message : String(error)}`,
                'LIST_UNCLAIM_DEPOSITS_FAILED'
            );
        }
    }

    /**
     * Claims a deposit
     * @param txId - Transaction ID
     * @param vout - Output index
     */
    async claimDeposit(txId: string, vout: number): Promise<void> {
        try {
            await this.wallet.claimDeposit({ txid: txId, vout })
        } catch (error) {
            throw new SDKError(
                `Failed to claim deposit: ${error instanceof Error ? error.message : String(error)}`,
                'CLAIM_DEPOSIT_FAILED'
            );
        }
    }

    /**
     * Fetches current prices
     * @returns Array of price rates
     */
    async fetchPrices(): Promise<PriceRate[]> {
        try {
            const response = await this.wallet.listFiatRates()
            return response.rates.map((v: Rate) => {
                return {
                    currency: v.coin,
                    value: v.value
                } as PriceRate
            })
        } catch (error) {
            throw new SDKError(
                `Failed to fetch prices: ${error instanceof Error ? error.message : String(error)}`,
                'FETCH_PRICES_FAILED'
            );
        }
    }

    /**
     * Disconnects the wallet
     */
    async disconnect(): Promise<void> {
        try {
            return await this.wallet.disconnect();
        } catch (error) {
            throw new SDKError(
                `Failed to disconnect wallet: ${error instanceof Error ? error.message : String(error)}`,
                'DISCONNECT_FAILED'
            );
        }
    }

    /**
     * Parses a recipient address to determine its type
     * @param address - Address to parse
     * @returns Address type
     */
    async parseRecipient(address: string): Promise<'spark' | 'bitcoin' | 'lightning'> {
        try {
            const parsed = await this.wallet.parse(address)
            switch (parsed.type) {
                case 'sparkAddress':
                    return 'spark'
                case 'bitcoinAddress':
                    return 'bitcoin'
                case 'lightningAddress':
                case 'bolt11Invoice':
                case 'bolt12Invoice':
                case 'lnurlPay':
                    return 'lightning'
                default:
                    throw new Error(`Unknown recipient type: ${parsed.type}`)
            }
        } catch (error) {
            throw new SDKError(
                `Failed to parse recipient: ${error instanceof Error ? error.message : String(error)}`,
                'PARSE_RECIPIENT_FAILED'
            );
        }
    }

    /**
     * Pays a Spark invoice
     * @param invoice - Spark invoice
     * @returns Payment details
     */
    async paySparkInvoice(invoice: string): Promise<{ paymentId: string; preimage?: string }> {
        try {
            const prepareResponse = await this.wallet.prepareSendPayment({
                paymentRequest: invoice
            })
            if (prepareResponse.paymentMethod.type != 'sparkInvoice') {
                throw new Error('Expecting Spark invoice')
            }

            const sendResponse = await this.wallet.sendPayment({
                prepareResponse,
            })
            return { paymentId: sendResponse.payment.id }
        } catch (error) {
            throw new SDKError(
                `Failed to pay Spark invoice: ${error instanceof Error ? error.message : String(error)}`,
                'PAY_SPARK_INVOICE_FAILED'
            );
        }
    }

    /**
     * Creates a Spark invoice
     * @returns Invoice string
     */
    async createSparkInvoice(): Promise<string> {
        try {
            const invoice = await this.wallet.receivePayment({
                paymentMethod: { type: 'sparkInvoice', amount: '0' },
            })
            return invoice.paymentRequest
        } catch (error) {
            throw new SDKError(
                `Failed to create Spark invoice: ${error instanceof Error ? error.message : String(error)}`,
                'CREATE_SPARK_INVOICE_FAILED'
            );
        }
    }
}