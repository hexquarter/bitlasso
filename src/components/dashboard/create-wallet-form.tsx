import type React from "react";
import { useEffect, useState } from "react";

import * as bip39 from '@scure/bip39';
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { WalletCreatedInformation } from "./wallet-created-information";

type Props = {
    onSubmit: (mnemonic: string) => void
    onBack: () => void
    loading: boolean
}

export const CreateWalletForm: React.FC<Props> = ({ onSubmit, loading = false }) => {
    const [mnemonic, setMnemonic] = useState<string[]>(["", "", "", "", "", "", "", "", "", "", "", ""]);

    useEffect(() => {
        const generatedMnemonic = bip39.generateMnemonic(wordlist);
        setMnemonic(generatedMnemonic.split(' '));
    }, []);

    const handleSubmit = () => {
        onSubmit(mnemonic.join(' '))
    }

    return (
        <WalletCreatedInformation onSubmit={handleSubmit} loading={loading} />
    )
}