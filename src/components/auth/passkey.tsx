
import {
    createPasskey,
    getWallet,
    listLabels,
    saveLabel,
    setPasskeyMode,
} from '@/lib/passkey';
import { passkeyPrfProvider } from '@/lib/passkeyProvider';
import type { Seed } from '@breeztech/breez-sdk-spark/web';
import { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangleIcon } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { Button } from '../ui/button';

/**
 * Phase state machine.
 *
 * On mount: "Use Passkey" was clicked → try listLabels() immediately.
 *   Success → passkey exists → returning user flow (connect-ready)
 *   Failure → no passkey    → new user flow (review)
 *
 * New user flow:
 *   detecting → review → creating  → new-storing 
 *             → connecting
 *
 * Returning user flow (existing label):
 *   detecting (prompt 1) → auth-pick → connecting → initializing
 */
type Phase =
    | 'detecting'       // On mount: listLabels() — WebAuthn prompt, doubles as detection
    // New user flow
    | 'review'          // Warning + I understand → triggers createPasskey()
    | 'creating'        // createPasskey() in progress (prompt)
    | 'new-storing'     // saveLabel() in progress (prompt)
    // Returning user flow
    | 'restore'       // Authenticate step: label picker
    // Shared
    | 'connecting'      // Connect to Nostr step: getWallet() in progress (prompt)

// ============================================
// Props
// ============================================

interface PasskeyPageProps {
    onWalletRestored: (seed: Seed, label: string) => void;
    onBack: () => void;
    sdkConnected?: boolean;
    onFlowComplete?: () => void;
}

// ============================================
// Component
// ============================================

const PasskeyPage: React.FC<PasskeyPageProps> = ({
    onWalletRestored,
    onBack
}) => {
    const [phase, setPhase] = useState<Phase>('detecting');
    const [error, setError] = useState<string | null>(null);

    // Stable refs for callbacks (avoid stale closures in effects)
    const onWalletRestoredRef = useRef(onWalletRestored);
    onWalletRestoredRef.current = onWalletRestored;

    // Label to use when entering the connecting phase
    const connectLabel = 'Default';

    // ============================================
    // Effects — auto-triggered phases
    // ============================================

    // On mount: detect passkey by trying listLabels() (WebAuthn get).
    useEffect(() => {
        if (phase !== 'detecting') return;
        let cancelled = false;

        const run = async () => {
            try {
                const found = await listLabels();
                if (cancelled) return;

                // Passkey exists → returning user
                if (found.length === 0) {
                    // Passkey exists but no labels on relays → auto-create "Default"
                    // and skip the picker. Mirrors the new-passkey path.
                    setPhase('new-storing');
                } else {
                    setPhase('connecting');
                }
            } catch (e) {
                console.log('No passkey detected with listLabels():', e);
                if (cancelled) return;
                setPhase('review');
            }
        };

        run();
        return () => {
            cancelled = true;
            passkeyPrfProvider.onAuthComplete = undefined;
        };
    }, [phase]);

    // New user: create passkey (prompt)
    useEffect(() => {
        if (phase !== 'creating' || error) return;
        let cancelled = false;

        const run = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Short delay to ensure UX flow
                console.log('Creating passkey with createPasskey() — this will trigger a WebAuthn prompt');
                await createPasskey();
                if (cancelled) return;
                setPhase('new-storing');
            } catch (e) {
                console.error('Error creating passkey:', e);
                if (cancelled) return;
                setError('Failed to create passkey');
            }
        };

        run();
        return () => { cancelled = true; };
    }, [phase, error]);

    // Save label to Nostr relays (prompt)
    useEffect(() => {
        if (phase !== 'new-storing' || error) return;
        let cancelled = false;

        const run = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Short delay to ensure UX flow
                await saveLabel(connectLabel);
                if (cancelled) return;
                // Don't setPasskeyMode here — wait until connecting succeeds to avoid
                // auto-reconnect on refresh before onboarding completes
                // Add newly saved label to the list so auth-pick is up-to-date on Go Back
                setPhase('connecting');
            } catch (e) {
                if (cancelled) return;
                setError('Failed to save label to Nostr');
            }
        };

        run();
        return () => { cancelled = true; };
    }, [phase, error]);

    // Connect: derive wallet (final prompt)
    useEffect(() => {
        if (phase !== 'connecting' || error) return;
        let cancelled = false;

        const run = async () => {
            try {
                const w = await getWallet(connectLabel);

                console.log('Derived wallet from passkey with getWallet()');
                if (cancelled) return;

                // Remember label locally
                setPasskeyMode(connectLabel);

                onWalletRestoredRef.current(w.seed, w.label);
            } catch (e) {
                if (cancelled) return;
                setError('Failed to connect');
            }
        };

        run();
        return () => { cancelled = true; };
    }, [phase, error]);

    // ============================================
    // Handlers
    // ============================================

    /** Clear error to re-trigger the current phase's effect. */
    const handleRetry = () => setError(null);

    /** Navigate back from an error state to the previous interactive phase. */
    const handleErrorBack = () => {
        setError(null);
        onBack();  // Returning user: nothing interactive to go back to
    };

    // ============================================
    // Render helpers
    // ============================================

    const renderDetecting = () => (
        <>
            <div className="flex flex-col gap-10">
                <h1 className="w-full font-serif text-4xl font-normal text-primary">Creating <span className="text-foreground">passkey.</span></h1>
                <p className="text-muted-foreground">Detecting passkey...</p>
            </div>

            <Spinner />
        </>
    );

    const renderReview = () => (
        <>
            <div className="flex flex-col gap-10">
                <h1 className="w-full font-serif text-4xl font-normal text-primary">Passkey <span className="text-foreground">authentication.</span></h1>
                <p className="text-muted-foreground">Passwordless authentication using a passkey stored on your device.</p>
            </div>

            {phase == 'review' &&
                <Alert className="bg-primary/10 border-1 border-primary/20">
                    <AlertTriangleIcon />
                    <AlertTitle>Your passkey is how you access your funds</AlertTitle>
                    <AlertDescription className="flex flex-col gap-2">
                        <p className="text-spark-text-secondary text-sm">
                            Deleting your passkey from your device, browser, or password manager may make your funds permanently inaccessible.
                        </p>
                    </AlertDescription>
                </Alert>}
        </>
    );

    const renderCreating = () => (
        <>
            <div className="flex flex-col gap-10">
                <h1 className="w-full font-serif text-4xl font-normal text-primary">Creating <span className="text-foreground">passkey.</span></h1>
                <p className="text-muted-foreground">Please follow the prompts in your browser to create a new passkey.</p>
            </div>

            {phase === 'creating' && <p className="text-spark-text-secondary text-sm">A passkey is creating on your device...</p>}
            {phase === 'new-storing' && <p className="text-spark-text-secondary text-sm">Saving metadata retrieval to Nostr relays...</p>}
            <Spinner />
        </>
    );

    const renderConnecting = () => (
        <>
            <div className="flex flex-col gap-10">
                <h1 className="w-full font-serif text-4xl font-normal text-primary">Connecting <span className="text-foreground">passkey.</span></h1>
                <p className="text-muted-foreground">The wallet is being initialized...</p>
            </div>
            <Spinner />
        </>
    );

    // ============================================
    // Content & footer routing
    // ============================================

    const content = (() => {
        switch (phase) {
            case 'detecting': return renderDetecting();
            case 'review': return renderReview();
            case 'creating': return error ? renderReview() : renderCreating();
            case 'new-storing':
                return renderCreating();
            case 'connecting':
                return renderConnecting();
        }
    })();

    const footer = (() => {
        // Error state on any auto-triggered phase: Retry + Back
        if (error && ['creating', 'new-storing', 'connecting'].includes(phase)) {
            return (
                <div className='flex flex-col lg:flex-row gap-2'>
                    <Button className='' variant='outline' onClick={handleErrorBack}>Back</Button>
                    <Button onClick={handleRetry} >Retry</Button>
                </div>
            );
        }

        if (phase === 'review') {
            return (
                <div className='flex flex-col lg:flex-row gap-2'>
                    <Button className='' variant='outline' onClick={() => onBack()}>Back</Button>
                    <Button onClick={() => {
                        setError(null);
                        setPhase('creating');
                    }} >I understand</Button>
                </div>
            );
        }

        return null;
    })();

    // ============================================
    // Layout
    // ============================================

    return (
        <div className="max-w-xl mx-auto w-full flex flex-col min-h-full gap-5">
            <div className="mt-6 space-y-4 flex flex-col flex-1">
                <div className='flex gap-2'>
                    <div className={`rounded-full w-2 h-2 bg-gray-200/50 ${phase === 'detecting' ? 'bg-primary animate-pulse' : ''}`}></div>
                    <div className={`rounded-full w-2 h-2 bg-gray-200/50 ${phase === 'review' ? 'bg-primary animate-pulse' : ''}`}></div>
                    <div className={`rounded-full w-2 h-2 bg-gray-200/50 ${phase === 'creating' || phase === 'new-storing' ? 'bg-primary animate-pulse' : ''}`}></div>
                    <div className={`rounded-full w-2 h-2 bg-gray-200/50 ${phase === 'connecting' ? 'bg-primary animate-pulse' : ''}`}></div>
                </div>
                {content}
                {error && (
                    <Alert className="bg-primary/10 border-1 border-primary/20">
                        <AlertTriangleIcon />
                        <AlertTitle>{error}</AlertTitle>
                        <AlertDescription className="flex flex-col gap-2">
                            <p className="text-spark-text-secondary text-sm">
                                {phase === 'new-storing' || phase === 'connecting'
                                    ? 'Please check your internet connection and try again.'
                                    : 'Please ensure your device supports passkeys and is the correct device.'}
                            </p>
                        </AlertDescription>
                    </Alert>
                )}
            </div>
            {footer}
        </div>
    );
};

export default PasskeyPage;