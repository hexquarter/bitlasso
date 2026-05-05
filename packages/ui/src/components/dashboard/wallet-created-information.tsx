import { ArrowRight, Coins, Rocket, Wallet } from "lucide-react"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"

type Props = {
    onSubmit: () => void
    loading: boolean
}

export const WalletCreatedInformation: React.FC<Props> = ({ onSubmit, loading = false}) => {
    return (
        <div className="flex flex-col gap-10 md:p-10">
            <div className="flex flex-col gap-10">
                <h1 className="w-full font-serif text-4xl font-normal text-foreground flex flex-col md:flex-row gap-2">Your wallet <span className="text-primary">is ready !</span></h1>
                <div className="flex flex-col gap-5 md:gap-5">
                    <p className="text-muted-foreground flex text-sm md:text-normal items-center gap-5">
                        <Coins className="h-6 w-6 text-primary text-left" />
                        <span className="flex-1">Mint tokens, issue work receipts and manage loyalty.</span>
                    </p>
                    <p className="text-muted-foreground flex text-sm md:text-normal items-center gap-5">
                        <Wallet className="w-6 h-6 text-primary text-left" />
                        <span className="flex-1">Receive and sends Bitcoin with your wallet at the speed of light with Spark.</span>
                    </p>
                    <p className="text-muted-foreground flex text-sm md:text-normal items-center gap-5">
                        <Rocket className="h-6 w-6 text-primary" />
                        <span className="flex-1">Your workspace is set up and ready to go.</span>
                    </p>
                </div>
            </div>
            <div className="flex lg:flex-row flex-col gap-2 items-center md:w-auto w-full">
                <Button type="submit" className='md:w-auto w-full' onClick={() => onSubmit()} disabled={loading}>
                    {loading ? 
                        <Spinner /> : 
                        <span className="flex items-center gap-2">Open the app <ArrowRight /></span>
                    }</Button>
            </div>
        </div>
    )
}