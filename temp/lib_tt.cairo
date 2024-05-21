use core::array::{ArrayTrait, SpanTrait};
use core::box::BoxTrait;
use starknet::{
    contract_address_const, get_tx_info, get_caller_address, testing::set_caller_address
};
use core::poseidon::PoseidonTrait;
use core::hash::{HashStateTrait, HashStateExTrait};
use openzeppelin::account::dual_account::{DualCaseAccount, DualCaseAccountABI};
use starknet::contract_address;
use core::felt252;
use starknet::{ContractAddress};
use openzeppelin::account::utils::{execute_calls, is_valid_stark_signature};

const STARKNET_DOMAIN_TYPE_HASH: felt252 =
    selector!("StarkNetDomain(name:felt,version:felt,chainId:felt)");

const SIMPLE_STRUCT_TYPE_HASH: felt252 =
    selector!("SimpleStruct(some_felt252:felt,some_u128:u128)");

#[derive(Drop, Copy, Hash)]
struct SimpleStruct {
    some_felt252: felt252,
    some_u128: u128,
}

#[derive(Drop, Copy, Hash)]
struct StarknetDomain {
    name: felt252,
    version: felt252,
    chain_id: felt252,
}

trait IStructHash<T> {
    fn hash_struct(self: @T) -> felt252;
}

trait IOffchainMessageHash<T> {
    fn get_message_hash(self: @T) -> felt252;
}

impl OffchainMessageHashSimpleStruct of IOffchainMessageHash<SimpleStruct> {
    fn get_message_hash(self: @SimpleStruct) -> felt252 {
        let domain = StarknetDomain {
            // name: 'dappName', version: 1, chain_id: get_tx_info().unbox().chain_id
            name: 'dappName', version: 1, chain_id: 23448594291968334
        };
        let mut state = PoseidonTrait::new();
        state = state.update_with('StarkNet Message');
        state = state.update_with(domain.hash_struct());
        // This can be a field within the struct, it doesn't have to be get_caller_address().
        state = state.update_with(get_caller_address());
        state = state.update_with(self.hash_struct());
        // Hashing with the amount of elements being hashed 
        state = state.update_with(4);
        state.finalize()
    }
}

impl StructHashStarknetDomain of IStructHash<StarknetDomain> {
    fn hash_struct(self: @StarknetDomain) -> felt252 {
        let state = PoseidonTrait::new();
        state.update_with(STARKNET_DOMAIN_TYPE_HASH).update_with(*self).update_with(4).finalize()
    }
}

impl StructHashSimpleStruct of IStructHash<SimpleStruct> {
    fn hash_struct(self: @SimpleStruct) -> felt252 {
        let mut state = PoseidonTrait::new();
        state = state.update_with(SIMPLE_STRUCT_TYPE_HASH);
        state = state.update_with(*self);
        state = state.update_with(3);
        state.finalize()
    }
}

#[starknet::contract]
mod Test {
    use super::{SimpleStruct, IOffchainMessageHash};
    use openzeppelin::account::dual_account::{DualCaseAccount, DualCaseAccountABI};
    use starknet::ContractAddress;

    #[constructor]
    fn constructor(ref self: ContractState) {}

    #[storage]
    struct Storage {}

    #[external(v0)]
    fn test(ref self: ContractState, to: ContractAddress) {
        //     // This value was computed using StarknetJS
        // let contract_address = "0x04A5E8d804d738D058aBEfA81Bf3C41092166124E68e3Ef028E3ac4798db533a";
        let message_hash = 0x4b2b4c975d01e5787f275759640ed61a310a19eb344f7f9d0bfd769b883c528;
        let simple_struct = SimpleStruct { some_felt252: 712, some_u128: 42 };

        assert(simple_struct.get_message_hash() == message_hash, 'Hash should be valid');

        let mut signature: Array<felt252> = ArrayTrait::new();
        signature.append(2368825182685665699801403077571462717301623232059436010532212017487460685619);
        signature.append(1528229586338241260553399602846793453504948709151802471632875770192990305073);

        // let address_felt = felt252::from_hex("0x04A5E8d804d738D058aBEfA81Bf3C41092166124E68e3Ef028E3ac4798db533a").expect("Invalid hex string");

        // // Create the ContractAddress from the felt252
        // let contract_address = contract_address::try_into(address_felt);

        // "0x04A5E8d804d738D058aBEfA81Bf3C41092166124E68e3Ef028E3ac4798db533a" 
        // ContractAddress

        let is_valid_signature_felt = DualCaseAccount { contract_address: to }.is_valid_signature(message_hash, signature);

        // Check either 'VALID' or True for backwards compatibility
        let is_valid_signature = is_valid_signature_felt == starknet::VALIDATED
            || is_valid_signature_felt == 1;
        assert(is_valid_signature, 'Invalid signature');

        // let is_valid_signature_felt = DualCaseAccount { contract_address: contract_address_try_from_felt252('0x04A5E8d804d738D058aBEfA81Bf3C41092166124E68e3Ef028E3ac4798db533a').unwrap() };
        // let a =  is_valid_signature_felt.is_valid_signature(message_hash, signature);

        // let is_valid_signature_felt = DualCaseAccount { contract_address: contract_address_const::<"0x04A5E8d804d738D058aBEfA81Bf3C41092166124E68e3Ef028E3ac4798db533a">()};
            // .is_valid_signature(message_hash, signature);

        // let is_valid_signature = is_valid_signature_felt == starknet::VALIDATED
        //         || is_valid_signature_felt == 1;
        // assert(is_valid_signature, 'Invalid signature');
    }
}

// #[test]
// #[available_gas(4000000)]
// fn test_valid_hash() {
//     // This value was computed using StarknetJS
//     // let contract_address = "0x04A5E8d804d738D058aBEfA81Bf3C41092166124E68e3Ef028E3ac4798db533a";
//     let message_hash = 0x4b2b4c975d01e5787f275759640ed61a310a19eb344f7f9d0bfd769b883c528;
//     let simple_struct = SimpleStruct { some_felt252: 712, some_u128: 42 };
//     set_caller_address(contract_address_const::<420>());
//     assert(simple_struct.get_message_hash() == message_hash, 'Hash should be valid');

//     // let owner = starknet::get_caller_address();

//     let mut signature: Array<felt252> = ArrayTrait::new();
//     signature.append(2368825182685665699801403077571462717301623232059436010532212017487460685619);
//     signature.append(1528229586338241260553399602846793453504948709151802471632875770192990305073);

//     // let address_felt = felt252::from_hex("0x04A5E8d804d738D058aBEfA81Bf3C41092166124E68e3Ef028E3ac4798db533a").expect("Invalid hex string");

//     // // Create the ContractAddress from the felt252
//     // let contract_address = contract_address::try_into(address_felt);

//     // "0x04A5E8d804d738D058aBEfA81Bf3C41092166124E68e3Ef028E3ac4798db533a" 
//     // ContractAddress

//     let is_valid_signature_felt = DualCaseAccount { contract_address: contract_address_const::<2102388189032220816183526209101376250322908640614599659278168500722103702330>() };
//     // .is_valid_signature(message_hash, signature);


//     // let is_valid_signature_felt = DualCaseAccount { contract_address: contract_address_try_from_felt252('0x04A5E8d804d738D058aBEfA81Bf3C41092166124E68e3Ef028E3ac4798db533a').unwrap() };
//     // let a =  is_valid_signature_felt.is_valid_signature(message_hash, signature);

//     // // Check either 'VALID' or True for backwards compatibility
//     // let is_valid_signature = is_valid_signature_felt == starknet::VALIDATED
//     //     || is_valid_signature_felt == 1;
//     // assert(is_valid_signature, 'Invalid signature');


//     // let is_valid_signature_felt = DualCaseAccount { contract_address: contract_address_const::<"0x04A5E8d804d738D058aBEfA81Bf3C41092166124E68e3Ef028E3ac4798db533a">()};
//         // .is_valid_signature(message_hash, signature);

//     // let is_valid_signature = is_valid_signature_felt == starknet::VALIDATED
//     //         || is_valid_signature_felt == 1;
//     // assert(is_valid_signature, 'Invalid signature');
// }
