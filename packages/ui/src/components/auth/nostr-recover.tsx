import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { AlertTriangleIcon, LockIcon } from 'lucide-react';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import * as bip39 from '@scure/bip39';
import { WalletCreatedInformation } from '../dashboard/wallet-created-information';
import { connectViaExtension, connectViaNsec, decryptPassphrase, encryptPassphrase, fetchEncryptedPassphrase, isNostrExtensionAvailable, RelayConfig, storeEncryptedPassphrase, type NostrConnection } from '@bitlasso/sdk';

interface NostrRecoverPassphraseProps {
    loading: boolean;
    onSuccess: (passphrase: string, nostrConnection: NostrConnection) => void;
    onBack: () => void;
}

type Phase = 'method-select' | 'connecting' | 'decrypting' | 'success' | 'error' | 'not-found';

export const NostrRecoverPassphrase: React.FC<NostrRecoverPassphraseProps> = ({ onSuccess, onBack, loading = false }) => {
    const relayConfig = new RelayConfig({ dev: import.meta.env.DEV })
    const [phase, setPhase] = useState<Phase>('method-select');
    const [nsecInput, setNsecInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [nostrConnection, setNostrConnection] = useState<NostrConnection | null>(null);
    const [passphrase, _setPassphrase] = useState<string | null>(null);
    const [accountCreated, setAccountCreated] = useState(false);

    const connectAndRecover = async (connection: NostrConnection) => {
        setNostrConnection(connection);
        setPhase('decrypting');
        setError(null);

        try {
            // Fetch encrypted passphrase from Nostr
            const encryptedPassphrase = await fetchEncryptedPassphrase(relayConfig, connection.pubkey);

            if (!encryptedPassphrase) {
                setPhase('not-found');
                return;
            }

            // Decrypt with NIP-44
            const decrypted = decryptPassphrase(encryptedPassphrase, connection);
            onSuccess(decrypted, connection);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setPhase('error');
        }
    };

    const handleExtensionConnect = async () => {
        if (!isNostrExtensionAvailable()) {
            setError('No Nostr extension detected. Please install Alby or nos2x.');
            return;
        }

        setPhase('connecting');
        setError(null);

        try {
            const connection = await connectViaExtension();
            await connectAndRecover(connection);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setPhase('error');
        }
    };

    const handleNsecConnect = async () => {
        if (!nsecInput.trim()) {
            setError('Please enter your nsec or private key');
            return;
        }

        setPhase('connecting');
        setError(null);

        try {
            const connection = connectViaNsec(nsecInput);
            await connectAndRecover(connection);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setPhase('error');
        }
    };

    const handleCreateAccount = async () => {
        if (!nostrConnection) {
            setError('No Nostr connection available');
            return;
        }

        const generatedMnemonic = bip39.generateMnemonic(wordlist);
        const encryptedPassphrase = encryptPassphrase(generatedMnemonic, nostrConnection);
        await storeEncryptedPassphrase(relayConfig, nostrConnection, encryptedPassphrase)

        setAccountCreated(true);
    }

    const handleSuccess = () => {
        if (!nostrConnection) {
            setError('No Nostr connection available');
            return;
        }
        if (!passphrase) {
            setError('Missing passphrase');
            return;
        }
        onSuccess(passphrase, nostrConnection);
    };

    const handleBack = () => {
        onBack();
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-10">
                    <h1 className="w-full font-serif text-4xl font-normal text-foreground">Recover your wallet via <span className="text-primary">Nostr.</span></h1>
                    <p className="text-muted-foreground">Use your Nostr identity to recover your passphrase</p>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive">
                    <AlertTriangleIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Method Selection */}
            {phase === 'method-select' && (
                <div className="flex flex-col gap-4">
                    <div className="space-y-5 ">
                        <p className="text-sm font-medium">Choose your connection method:</p>
                        <div>
                            <Button
                                onClick={handleExtensionConnect}
                                className="justify-start "
                                variant="outline"
                                disabled={!isNostrExtensionAvailable()}
                            >
                                <LockIcon className="h-4 w-4" />
                                <span className="">
                                    {isNostrExtensionAvailable()
                                        ? <p className='flex gap-2'>Use Nostr Extension <span className='hidden lg:block'>(Alby, nos2x, etc.)</span></p>
                                        : 'No Extension Detected'}
                                </span>
                            </Button>

                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nsec">Enter your private key (nsec1... or hex)</Label>
                            <Input
                                id="nsec"
                                type="password"
                                placeholder="nsec1... or your hex private key"
                                value={nsecInput}
                                onChange={(e) => setNsecInput(e.target.value)}
                                className="font-mono text-sm"
                            />
                        </div>

                        <div className='flex gap-2'>
                            <div>
                                <Button
                                    onClick={handleNsecConnect}
                                    className="flex-1"
                                    disabled={!nsecInput.trim()}
                                >
                                    Recover
                                </Button>
                            </div>
                            <div>
                                <Button
                                    onClick={() => handleBack()}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                            </div>
                        </div>

                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                        Your wallet passphrase is encrypted and stored securely on Nostr relays.
                    </p>
                </div>
            )}

            {/* Connecting */}
            {phase === 'connecting' && (
                <div className="flex flex-col items-center gap-4 py-8">
                    <Spinner />
                    <p className="text-sm text-muted-foreground">Connecting to Nostr...</p>
                </div>
            )}

            {/* Decrypting */}
            {phase === 'decrypting' && (
                <div className="flex flex-col items-center gap-4 py-8">
                    <Spinner />
                    <p className="text-sm text-muted-foreground">Decrypting your passphrase...</p>
                </div>
            )}

            {/* Passphrase Not Found */}
            {phase === 'not-found' && (
                <div className="flex flex-col gap-4">
                    <Alert>
                        <AlertTriangleIcon className="h-4 w-4" />
                        <AlertTitle>No backup found</AlertTitle>
                        <AlertDescription>
                            We couldn't find an encrypted passphrase for this Nostr identity.
                            This could mean: you haven't set up a backup yet, or you're using a different Nostr key.
                        </AlertDescription>
                    </Alert>
                    <div className="flex gap-3">
                        <Button onClick={handleCreateAccount} className="flex-1">
                            Create a new wallet with this Nostr identity
                        </Button>
                        <Button onClick={onBack} variant="outline" className="flex-1">
                            Back
                        </Button>
                    </div>
                </div>
            )}

            {accountCreated && (
                <WalletCreatedInformation onSubmit={handleSuccess} loading={loading} />
            )}

            {/* Error Phase */}
            {phase === 'error' && (
                <div className="flex flex-col gap-4">
                    <Alert variant="destructive">
                        <AlertTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Recovery Failed</AlertTitle>
                        <AlertDescription>
                            {error || 'Failed to recover passphrase. Please try again.'}
                        </AlertDescription>
                    </Alert>
                    <Button onClick={handleBack} className="w-full">
                        Try Again
                    </Button>
                </div>
            )}
        </div>
    );
};
