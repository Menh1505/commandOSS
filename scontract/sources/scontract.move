module scontract::scontract{
    use sui::random::{Self, Random, new_generator};
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::hash;
    use std::vector;

    const E_INVALID_INPUT: u64 = 0;
    const E_INVALID_TURN: u64 = 1;
    const E_MUST_ALIVE: u64 = 2;

    public struct PlayerProfile has key, store {
        id: UID,
        owner: address,
        level: u64,
        hp: u64,
        atk: u64,
        def: u64,
        crit_rate: u64, // thousandth, ex 100 = 10%
    }

    public struct BotEnemy has store {
        hp: u64,
        atk: u64,
        def: u64,
        crit_rate: u64,
    }

    /// Trạng thái trận đấu
    public struct BattleState has key, store {
        id: UID,
        owner: address,
        player_hp: u64,
        bot_hp: u64,
        player_atk: u64,
        player_def: u64,
        bot_atk: u64,
        bot_def: u64,
        result: u8, //0: playing, 1: player, 2: enemy win
        turn: u8, // 0: player's turn, 1: bot's turn
    }

    /// Khởi tạo trận PvE
    public entry fun start_battle(ctx: &mut TxContext) {
        let uid = object::new(ctx);
        let sender = tx_context::sender(ctx);

        let state = BattleState {
            id: uid,
            owner: sender,
            player_hp: 100,
            bot_hp: 80,
            player_atk: 20,
            player_def: 5,
            bot_atk: 15,
            bot_def: 3,
            result: 0,
            turn: 0,
        };

        transfer::transfer(state, sender);
    }

    /// Người chơi tấn công
    public entry fun player_attack(state: &mut BattleState, r: &Random, ctx: &mut TxContext) {
        assert!(state.turn == 0, E_INVALID_TURN); // chỉ khi tới lượt player
        assert!(state.player_hp > 0 && state.bot_hp > 0, E_MUST_ALIVE); // cả 2 còn sống

        let final_dmg = calc_dmg(state.player_atk, state.bot_def, 500, r, ctx);

        state.bot_hp = if (final_dmg >= state.bot_hp){
            state.result = 1;
            0
        } else (state.bot_hp - final_dmg);
        state.turn = 1;
    }
    
    /// Bot phản đòn
    public entry fun bot_attack(state: &mut BattleState, r: &Random, ctx: &mut TxContext) {
        assert!(state.turn == 1, E_INVALID_TURN); // chỉ khi tới lượt bot
        assert!(state.player_hp > 0 && state.bot_hp > 0, E_MUST_ALIVE); // cả 2 còn sống

        let final_dmg = calc_dmg(state.bot_atk, state.player_def, 500, r, ctx);

        state.player_hp = if (final_dmg >= state.player_hp){
            state.result = 2;
            0
        } else (state.player_hp - final_dmg);
        state.turn = 0;
    }

    fun getRandom(r: &Random, ctx: &mut TxContext): u64 {
        let mut generator = new_generator(r, ctx);
        generator.generate_u64_in_range(0,1000)
    }

    fun calc_dmg(atk: u64, def: u64, crit_rate: u64, r: &Random, ctx: &mut TxContext): u64 {
        assert!(crit_rate <= 1000, E_INVALID_INPUT);
        if (def > atk) return 0;

        let rate = getRandom(r, ctx);
        if (rate > crit_rate) {
            (atk * 150 / 100) - def
        } else {
            atk - def 
        }
    }
    

}

