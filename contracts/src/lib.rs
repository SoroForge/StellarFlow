#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Map, String, Vec};

mod storage;
mod split;
mod errors;

#[contract]
pub struct StellarFlowContract;

#[contractimpl]
impl StellarFlowContract {
    // Contract entry points go here
}
