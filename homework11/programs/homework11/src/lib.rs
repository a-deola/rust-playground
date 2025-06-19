use anchor_lang::prelude::*;

declare_id!("2jxzZnQWeYb83Uqh7LGgz4g5VgJz1zgT5quUFnZNBAfr");

pub const ANCHOR_DISCRIMINATOR_LENGTH: usize = 8;

#[program]
pub mod homework11 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let account: &mut Account<'_, BalanceAccount> = &mut ctx.accounts.balance_account;
        account.balance = 100;
        Ok(())
    }
    pub fn increment(ctx: Context<UpdateBalance>) -> Result<()> {
        let account: &mut Account<'_, BalanceAccount> = &mut ctx.accounts.balance_account;

        if account.balance >= 1000 {
            return err!(CustomError::MaxBalanceReached);
        }

        account.balance = (account.balance + 100).min(1000);
        Ok(())
    }

    #[derive(Accounts)]
    pub struct Initialize<'info> {
        #[account(init, payer = user, space = ANCHOR_DISCRIMINATOR_LENGTH + BalanceAccount::LEN)]
        pub balance_account: Account<'info, BalanceAccount>,
        #[account(mut)]
        pub user: Signer<'info>,
        pub system_program: Program<'info, System>,
    }

    #[derive(Accounts)]
    pub struct UpdateBalance<'info> {
        #[account(mut)]
        pub balance_account: Account<'info, BalanceAccount>,
    }

    #[account]
    pub struct BalanceAccount {
        pub balance: u64,
    }

    impl BalanceAccount {
        pub const LEN: usize = 8; // 8 bytes for u64 balance
    }

    #[error_code]
    pub enum CustomError {
        #[msg("Balance has reached the maximum value of 1000.")]
        MaxBalanceReached,
    }
}
