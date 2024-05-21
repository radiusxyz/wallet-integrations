use openzeppelin::utils::snip12::{SNIP12Metadata, StructHash, OffchainMessageHashImpl};

use core::hash::HashStateExTrait;
use core::hash::{HashStateTrait, Hash};
use core::poseidon::PoseidonTrait;
use starknet::ContractAddress;

const MESSAGE_TYPE_HASH: felt252 =
    0x120ae1bdaf7c1e48349da94bb8dad27351ca115d6605ce345aee02d68d99ec1;

#[derive(Copy, Drop, Hash)]
struct TestMessage {
    to: ContractAddress
}

impl StructHashImpl2 of StructHash<TestMessage> {
    fn hash_struct(self: @TestMessage) -> felt252 {
        let hash_state = PoseidonTrait::new();
        hash_state.update_with(MESSAGE_TYPE_HASH).update_with(*self).finalize()
    }
}


#[derive(Copy, Drop, Hash)]
struct Message {
    recipient: ContractAddress,
    amount: u256,
    nonce: felt252,
    expiry: u64
}

impl StructHashImpl of StructHash<Message> {
    fn hash_struct(self: @Message) -> felt252 {
        let hash_state = PoseidonTrait::new();
        hash_state.update_with(MESSAGE_TYPE_HASH).update_with(*self).finalize()
    }
}

#[starknet::contract]
mod CustomERC20 {
    use openzeppelin::account::dual_account::{DualCaseAccount, DualCaseAccountABI};
    use openzeppelin::token::erc20::ERC20Component;
    use openzeppelin::utils::cryptography::nonces::NoncesComponent;
    use starknet::ContractAddress;

    use super::{Message, OffchainMessageHashImpl, SNIP12Metadata};

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);
    component!(path: NoncesComponent, storage: nonces, event: NoncesEvent);

    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl NoncesImpl = NoncesComponent::NoncesImpl<ContractState>;
    impl NoncesInternalImpl = NoncesComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        #[substorage(v0)]
        nonces: NoncesComponent::Storage
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
        #[flat]
        NoncesEvent: NoncesComponent::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_supply: u256, recipient: ContractAddress) {
        self.erc20.initializer("MyToken", "MTK");
        self.erc20._mint(recipient, initial_supply);
    }

    /// Required for hash computation.
    impl SNIP12MetadataImpl of SNIP12Metadata {
        fn name() -> felt252 {
            'CustomERC20'
        }
        fn version() -> felt252 {
            'v1'
        }
    }
    
    #[external(v0)]
    fn test(ref self: ContractState) {
    }

    #[external(v0)]
    fn transfer_with_signature(
        ref self: ContractState,
        recipient: ContractAddress,
        amount: u256,
        nonce: felt252,
        expiry: u64,
        signature: Array<felt252>
    ) {
        assert(starknet::get_block_timestamp() <= expiry, 'Expired signature');
        let owner = starknet::get_caller_address();

        // Check and increase nonce
        self.nonces.use_checked_nonce(owner, nonce);

        // Build hash for calling `is_valid_signature`
        let message = Message { recipient, amount, nonce, expiry };
        let hash = message.get_message_hash(owner);

        let is_valid_signature_felt = DualCaseAccount { contract_address: owner }
            .is_valid_signature(hash, signature);

        // Check either 'VALID' or True for backwards compatibility
        let is_valid_signature = is_valid_signature_felt == starknet::VALIDATED
            || is_valid_signature_felt == 1;
        assert(is_valid_signature, 'Invalid signature');

        // Transfer tokens
        self.erc20._transfer(owner, recipient, amount);
    }


    #[external(v0)]
    fn test_with_signature(
        ref self: ContractState,
        to: ContractAddress,
        signature: Array<felt252>
    ) {
        // Build hash for calling `is_valid_signature`
        let message = TestMessage { to };
        let hash = message.get_message_hash(to);

        let is_valid_signature_felt = DualCaseAccount { contract_address: to }
            .is_valid_signature(hash, signature);

        // Check either 'VALID' or True for backwards compatibility
        let is_valid_signature = is_valid_signature_felt == starknet::VALIDATED
            || is_valid_signature_felt == 1;
        assert(is_valid_signature, 'Invalid signature');
    }
}