import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

import { PassphraseForm } from "@/components/dashboard/passphrase-form";
import { CreateWalletForm } from "@/components/dashboard/create-wallet-form";
import { useNavigate } from "react-router";
import { useWallet } from "@/hooks/use-wallet";
import { usePostHog } from "@posthog/react";

import LogoPng from '../../public/logo.svg'
import { fetchSettings, registerSettings } from "@/lib/nostr";
import { Button } from "@/components/ui/button";
import PasskeyPage from "@/components/auth/passkey";
import { NostrRecoverPassphrase } from "@/components/auth/nostr-recover";
import type { Seed } from "@breeztech/breez-sdk-spark/web";
import type { NostrConnection } from "@/lib/nostr-connect";

export const LoginPage = () => {
    const { storeWallet, connectWithSeed } = useWallet()
    const [showPassphraseForm, setShowPassphraseForm] = useState(false)
    const [showCreateWalletForm, setShowCreateWalletForm] = useState(false)
    const [showRecoveryOptions, setShowRecoveryOptions] = useState(false)
    const [showNostrRecover, setShowNostrRecover] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const posthog = usePostHog()
    const [showPasskey, setShowPasskey] = useState(false)

    const handlePassphraseSubmit = async (mnemonic: string) => {
        setLoading(true)
        console.log('authenticating user...')
        localStorage.setItem('BITLASSO_SECURED_MNEMONIC', 'true')

        const wallet = await storeWallet(mnemonic)
        const sparkAddress = await wallet.getSparkAddress()
        posthog?.identify(sparkAddress)
        void (() => posthog?.capture('wallet_connected'))()

        const settings = await fetchSettings(wallet)
        if (!settings) {
            console.log('initializing wallet settings')
            await registerSettings(wallet, {
                sparkIdentityKey: await wallet.getIdentityPubkey()
            })
        }
        else if (!settings.sparkIdentityKey) {
            settings.sparkIdentityKey = await wallet.getIdentityPubkey()
            await registerSettings(wallet, settings)
        }

        setLoading(false)
        navigate('/app/dashboard', { replace: true })
    }

    const handleCreateWalletSubmit = async (mnemonic: string) => {
        setLoading(true)

        const wallet = await storeWallet(mnemonic)
        const sparkAddress = await wallet.getSparkAddress()
        posthog?.identify(sparkAddress)
        posthog?.capture('wallet_created')

        const settings = await fetchSettings(wallet)
        if (!settings) {
            console.log('initializing wallet settings')
            await registerSettings(wallet, {
                sparkIdentityKey: await wallet.getIdentityPubkey()
            })
        }
        else if (!settings.sparkIdentityKey) {
            settings.sparkIdentityKey = await wallet.getIdentityPubkey()
            await registerSettings(wallet, settings)
        }

        setLoading(false)
        navigate('/app/dashboard', { replace: true })
    }

    const handlePasskeyConnect = async (seed: Seed) => {
        setLoading(true)
        console.log('authenticating user with passkey...')
        localStorage.setItem('BITLASSO_SECURED_MNEMONIC', 'true')
        try {
            const wallet = await connectWithSeed(seed)
            console.log('passkey authentication successful, wallet connected')
            const sparkAddress = await wallet.getSparkAddress()
            posthog?.identify(sparkAddress)

            const settings = await fetchSettings(wallet)
            if (!settings) {
                console.log('initializing wallet settings')
                await registerSettings(wallet, {
                    sparkIdentityKey: await wallet.getIdentityPubkey()
                })
            }
            else if (!settings.sparkIdentityKey) {
                settings.sparkIdentityKey = await wallet.getIdentityPubkey()
                await registerSettings(wallet, settings)
            }

            setLoading(false)
            navigate('/app/dashboard', { replace: true })
        } catch (e) {
            console.error('Passkey authentication failed:', e)
            setLoading(false)
        }
    };

    const handleNostrPassphraseRecovered = async (passphrase: string, nostrConnection: NostrConnection) => {
        setLoading(true)
        localStorage.setItem('BITLASSO_SECURED_MNEMONIC', 'true')
        try {
            console.log('Restoring wallet with recovered passphrase from Nostr...')
            const wallet = await storeWallet(passphrase)
            const sparkAddress = await wallet.getSparkAddress()
            posthog?.identify(sparkAddress)
            void (() => posthog?.capture('wallet_recovered_nostr'))()

            const settings = await fetchSettings(wallet)
            if (!settings) {
                console.log('initializing wallet settings')
                await registerSettings(wallet, {
                    notification: {
                        npub: nostrConnection.npub
                    },
                    sparkIdentityKey: await wallet.getIdentityPubkey()
                })
            }
            else if (!settings.sparkIdentityKey) {
                settings.sparkIdentityKey = await wallet.getIdentityPubkey()
                settings.notification = {
                    npub: nostrConnection.npub
                }
                await registerSettings(wallet, settings)
            }
            else {
                settings.notification = {
                    npub: nostrConnection.npub
                }
                await registerSettings(wallet, settings)
            }

            setLoading(false)
            navigate('/app/dashboard', { replace: true })
        } catch (error) {
            console.error('Error restoring wallet:', error)
            setLoading(false)
        }
    };

    return (
        <div className="lg:grid lg:grid-cols-5 min-h-svh">
            {/* Left panel -- branding */}
            <div className="lg:col-1"></div>
            <div className="h-full fixed flex col-1 flex-col justify-between overflow-hidden bg-white p-12 hidden lg:flex">
                {/* Subtle grid pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff601c' fill-opacity='1'%3E%3Cpath d='M0 0h1v40H0V0zm39 0h1v40h-1V0zM0 0h40v1H0V0zm0 39h40v1H0v-1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                {/* Logo */}
                <div className="relative z-10">
                    <div className='flex items-center gap-2 hover:cursor-pointer' onClick={() => window.open('/', 'blank')} >
                        <img src={LogoPng} className='w-10' />
                        <div className='font-serif tracking-tighter text-foreground flex items-center'>
                            <p className="flex gap-2 items-end">
                                <span className="text-5xl"><span className="text-primary">bit</span>lasso</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Center content */}
                <div className="relative z-10 max-w-md">
                    <p className="font-mono text-sm font-medium tracking-[0.2em] text-foreground/40 uppercase">
                        Business Dashboard
                    </p>
                    <h1 className="mt-4 font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] tracking-[-0.02em] text-foreground">
                        Your checkout.
                        <br />
                        Your clients.
                        <br />
                        <span className="text-primary">Your business.</span>
                    </h1>
                    <p className="mt-6 text-base leading-relaxed text-foreground/50">
                        Manage payment requests, track earned credits, and build
                        lasting client relationships from a single dashboard.
                    </p>
                </div>

                {/* Bottom quote */}
                <div className="relative z-10">
                    <blockquote className="border-l-2 border-primary/40 pl-5">
                        <p className="text-sm italic leading-relaxed text-foreground">
                            {"\""}Bitcoin-native payments for the actual work.{"\""}
                        </p>
                    </blockquote>
                </div>
            </div>

            {/* Right panel -- form */}
            <div className="lg:col-2 lg:col-span-4 flex flex-1 items-center justify-center px-6 py-12 lg:px-12 bg-slate-50 min-h-screen">
                <div className="w-full max-w-lg lg:max-w-2xl">
                    {/* Mobile logo */}
                    <div className="mb-10 lg:hidden hover:cursor-pointer" onClick={() => window.open('/', 'blank')} >
                        <a href="/" className="">
                            <div className='flex items-center justify-center gap-2'>
                                <img src={LogoPng} className='w-10' />
                                <div className='font-serif tracking-tighter text-foreground flex items-center'>
                                    <p className="flex gap-2 items-end">
                                        <span className="text-5xl"><span className="text-primary">bit</span>lasso</span>
                                    </p>
                                </div>
                            </div>
                        </a>
                    </div>

                    <Card className="w-full">
                        <CardContent>
                            {!showPasskey && !showNostrRecover && !showPassphraseForm && !showCreateWalletForm && !showRecoveryOptions && <div className="flex flex-col gap-10 p-5 lg:p-20 ">
                                <div className="flex flex-col items-center gap-10 text-center ">
                                    <h1 className="w-full font-serif text-4xl font-normal text-foreground">
                                        Welcome !
                                    </h1>
                                    <h2 className="w-full font-serif text-2xl lg:text-3xl font-normal text-foreground">Access your <span className="text-primary">workspace</span></h2>
                                </div>
                                <div className="flex justify-center">
                                    <div className="flex flex-col gap-5 lg:w-1/2 ">
                                        <Button onClick={() => setShowPasskey(true)}>Use Passkey</Button>
                                        <Button onClick={() => setShowNostrRecover(true)} variant='outline'>Connect with Nostr</Button>
                                        <div className="flex gap-5 items-center">
                                            <div className="h-1 border-b flex-1"></div>
                                            <span className="text-xs text-foreground/50 ">or</span>
                                            <div className="h-1 border-b flex-1"></div>
                                        </div>
                                        <Button variant="ghost" className="text-muted-foreground text-sm cursor-pointer" onClick={() => setShowRecoveryOptions(true)}>Use recovery phrase instead</Button>
                                    </div>
                                </div>
                                <p className="text-xs px-6 text-slate-400 text-center">Non-custodial. Your keys stay with you.</p>
                            </div>}
                            {showPasskey && <PasskeyPage onWalletRestored={handlePasskeyConnect} onBack={() => setShowPasskey(false)} />}
                            {showNostrRecover && (
                                <NostrRecoverPassphrase
                                    loading={loading}
                                    onSuccess={handleNostrPassphraseRecovered}
                                    onBack={() => setShowNostrRecover(false)}
                                />
                            )}
                            {!showPasskey && !showNostrRecover && !showPassphraseForm && !showCreateWalletForm && showRecoveryOptions && <div className="flex flex-col gap-10 p-0 lg:p-20 ">
                                <div className="flex flex-col items-center gap-10 text-center ">
                                    <h1 className="w-full font-serif text-4xl font-normal text-foreground">
                                        Welcome !
                                    </h1>
                                    <h2 className="w-full font-serif text-2xl lg:text-3xl font-normal text-foreground">Access your <span className="text-primary">workspace</span></h2>
                                </div>
                                <div className="flex justify-center">
                                    <div className="flex flex-col gap-5 lg:w-1/2 ">
                                        <Button onClick={() => setShowCreateWalletForm(true)}>Create wallet</Button>
                                        <Button variant='outline' onClick={() => setShowPassphraseForm(true)}>Restore your wallet</Button>
                                        <Button variant="ghost" className="text-muted-foreground text-sm cursor-pointer" onClick={() => setShowRecoveryOptions(false)}>Back</Button>
                                    </div>
                                </div>
                                <p className="text-xs px-6 text-slate-400 text-center">Non-custodial. Your keys stay with you.</p>
                            </div>}
                            {showPassphraseForm &&
                                <PassphraseForm onSubmit={handlePassphraseSubmit} onBack={() => { setShowPassphraseForm(false); setShowRecoveryOptions(true); }} loading={loading} />
                            }
                            {showCreateWalletForm &&
                                <CreateWalletForm onSubmit={handleCreateWalletSubmit} onBack={() => { setShowCreateWalletForm(false); setShowRecoveryOptions(true); }} loading={loading} />
                            }
                        </CardContent>
                    </Card>

                    <div className="mt-10 max-w-md lg:hidden text-center">
                        <p className="font-mono text-[10px] font-medium tracking-[0.2em] text-foreground/40 uppercase">
                            Business Dashboard
                        </p>
                        <h1 className="mt-4 font-serif text-sm leading-[1.1] tracking-[-0.02em] text-foreground">
                            Your checkout.
                            Your clients.
                            <span className="text-primary ml-1">Your business.</span>
                        </h1>
                        <p className="mt-1 text-[11px] leading-relaxed text-foreground/50">
                            Bitcoin-native payments for the actual work.

                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
