module scontract::pvp {
    use sui::random::{Random, new_generator};

    const E_INVALID_INPUT: u64 = 0;
    const E_INVALID_TURN: u64 = 1;
    const E_NOT_READY: u64 = 3;
    const E_ROOM_FULL: u64 = 4;

    public struct PvPBattleState has key, store {
        id: UID,
        room_master: address,
        player_number: u8,
        hp1: u64,
        hp2: u64,
        atk1: u64,
        atk2: u64,
        def1: u64,
        def2: u64,
        turn: u8, // 0: waiting, 1: player1, 2: player2
        result: u8, // 0: playing, 1: player1 win, 2: player2 win
    }

    public entry fun create_pvp(ctx: &mut TxContext) {
        let uid = object::new(ctx);
        let sender = tx_context::sender(ctx);

        let battle = PvPBattleState {
            id: uid,
            room_master: sender,
            player_number: 1,
            hp1: 100,
            hp2: 100,
            atk1: 20,
            atk2: 20,
            def1: 5,
            def2: 5,
            turn: 0, //1: player1, 2: player2, 0: not started 
            result: 0,
        };
        transfer::transfer(battle, sender);
    }

    public entry fun join_pvp(battle: &mut PvPBattleState) {
        assert!(battle.player_number == 2, E_ROOM_FULL);
        battle.player_number = 2;
        battle.turn = 1;
    }

    #[allow(lint(public_random))]
    public entry fun attack_pvp(battle: &mut PvPBattleState, r: &Random, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(battle.turn == 0, E_NOT_READY);

        if (battle.turn == 1) {
            assert!(sender == battle.room_master, E_INVALID_TURN);
            let dmg = calc_dmg(battle.atk1, battle.def2, 500, r, ctx);
            battle.hp2 = if (dmg >= battle.hp2) {
                battle.result = 1;
                0
            } else { battle.hp2 - dmg };
            battle.turn = 2;
        } else if (battle.turn == 2) {
            assert!(sender != battle.room_master, E_INVALID_TURN);
            let dmg = calc_dmg(battle.atk2, battle.def1, 500, r, ctx);
            battle.hp1 = if (dmg >= battle.hp1) {
                battle.result = 2;
                0
            } else { battle.hp1 - dmg };
            battle.turn = 1;
        } else {
            assert!(false, E_INVALID_TURN);
        }
    }
   

    fun getRandom(r: &Random, ctx: &mut TxContext): u64 {
        let mut generator = new_generator(r, ctx);
        generator.generate_u64_in_range(0,1000)
    }

    fun calc_dmg(atk: u64, def: u64, crit_rate: u64, r: &Random, ctx: &mut TxContext): u64 {
        assert!(crit_rate <= 1000, E_INVALID_INPUT);
        if (def > atk) return 0;

        let rate = getRandom(r, ctx);
        if (rate < crit_rate) {
            (atk * 150 / 100) - def
        } else {
            atk - def
        }
    }
}
