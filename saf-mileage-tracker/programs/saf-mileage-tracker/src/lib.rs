use anchor_lang::prelude::*;

declare_id!("HuABhgNHpzcRrsT7skSm5PQMiCXp8bUbefjeBzf9WBF9");

#[program]
pub mod saf_mileage_tracker {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
