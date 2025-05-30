module nft_minter::nft_minter {

    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    struct NFT has key, store, drop {
        id: UID,
        name: String,
        description: String,
        url: String,
    }

    public entry fun mint_nft(
        name: String,
        description: String,
        url: String,
        ctx: &mut TxContext
    ) {
        let nft = NFT {
            id: object::new(ctx),
            name,
            description,
            url,
        };

        transfer::transfer(nft, tx_context::sender(ctx));
    }
}
