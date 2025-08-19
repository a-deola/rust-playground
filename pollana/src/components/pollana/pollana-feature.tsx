import { WalletButton } from '../solana/solana-provider'
import { PollanaButtonInitialize, PollanaList, PollanaProgramExplorerLink, PollanaProgramGuard } from './pollana-ui'
import { AppHero } from '../app-hero'
import { useWalletUi } from '@wallet-ui/react'

export default function PollanaFeature() {
  const { account } = useWalletUi()

  return (
    <PollanaProgramGuard>
      <AppHero
        title="Pollana"
        subtitle={
          account
            ? "Initialize a new pollana onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <PollanaProgramExplorerLink />
        </p>
        {account ? (
          <PollanaButtonInitialize />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletButton />
          </div>
        )}
      </AppHero>
      {account ? <PollanaList /> : null}
    </PollanaProgramGuard>
  )
}
