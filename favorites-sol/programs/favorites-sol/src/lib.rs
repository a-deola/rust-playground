use anchor_lang::prelude::*;

declare_id!("4uhTqFVY5SNyWgoMhWTkQikPf68GkkMmhDZy4LCp2GQ3");

pub const   ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod favorites_sol {
    use super::*;

    pub fn set_favorites(context: Context<SetFavorites>, number: u64, color: String, hobbies: Vec<String>,)-> Result<()>{
        msg! ("Greetings from {}", context.program_id);
        let user_public_key = context.accounts.user.key();

        msg!("User {user_public_key}'s ")
        context.accounts.favorites.set_inner(Favorites(number, color, hobbies));
        OK(());
    }

}

#[account]
#[derive(InitSpace)]
pub struct Favorites{
    pub number: u64,

    #[max_len(50)]
    pub color: String, 

    #[max_len(5, 50)]
    pub hobbies: Vec<String>,
}

#[derive(Accounts)]
pub struct SetFavorites <'info>{
    #[account(mut)]
    pub user: Signer<'info>

    #[account(init_if_needed, 
    payer = user,
    space = ANCHOR_DISCRIMINATOR_SIZE + Favorites::INITSPACE,
    seeds = [b"favorites", user.key().as_ref()],
    bump
)]
    pub favorites: Account<'info, Favorites>,
    pub system_program: Program<'info, System>,
}