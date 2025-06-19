import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Homework11 } from "../target/types/homework11";
import { assert } from "chai";

describe("homework11", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();

  const program = anchor.workspace.homework11 as Program<Homework11>;

  it("Initializes the balance to 100", async () => {
    const balanceAccount = anchor.web3.Keypair.generate();

    await program.methods
      .initialize()
      .accounts({
        balanceAccount: balanceAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .signers([balanceAccount])
      .rpc();

    const account = await program.account.balanceAccount.fetch(
      balanceAccount.publicKey
    );
    assert.equal(account.balance.toNumber(), 100);
  });
});
