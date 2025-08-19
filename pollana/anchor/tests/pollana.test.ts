import * as anchor from '@coral-xyz/anchor'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { assert } from 'chai'
import { Pollana } from '../target/types/pollana'

const IDL = require('../target/idl/pollana.json')

const pollanaAddress = new PublicKey('JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H')
describe('pollana', () => {
  it('Initialize Pollana', async () => {
    const context = await startAnchor('', [{ name: 'pollana', programId: pollanaAddress }], [])
    const provider = new BankrunProvider(context)

    const pollanaProgram = new Program<Pollana>(IDL, provider)
    await pollanaProgram.methods
      .initializePoll(
        new anchor.BN(1),
        'What is your favorite type of peanut butter',
        new anchor.BN(0),
        new anchor.BN(1855533633),
      )
      .rpc()

    // const [pollAddress] = PublicKey.findProgramAddressSync()
  })
})
