// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, address, getBase58Decoder, SolanaClient } from 'gill'
import { SolanaClusterId } from '@wallet-ui/react'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Pollana, POLLANA_DISCRIMINATOR, POLLANA_PROGRAM_ADDRESS, getPollanaDecoder } from './client/js'
import PollanaIDL from '../target/idl/pollana.json'

export type PollanaAccount = Account<Pollana, string>

// Re-export the generated IDL and type
export { PollanaIDL }

// This is a helper function to get the program ID for the Pollana program depending on the cluster.
export function getPollanaProgramId(cluster: SolanaClusterId) {
  switch (cluster) {
    case 'solana:devnet':
    case 'solana:testnet':
      // This is the program ID for the Pollana program on devnet and testnet.
      return address('6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF')
    case 'solana:mainnet':
    default:
      return POLLANA_PROGRAM_ADDRESS
  }
}

export * from './client/js'

export function getPollanaProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getPollanaDecoder(),
    filter: getBase58Decoder().decode(POLLANA_DISCRIMINATOR),
    programAddress: POLLANA_PROGRAM_ADDRESS,
  })
}
