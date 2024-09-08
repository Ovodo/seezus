address 0xc03556bd82d64b147b985e1473601aa2df75ddfc398043f431b0460e2a05ada1 {
module Seezus {
    use std::signer;
    use aptos_framework::randomness;
    use aptos_std::simple_map;
    use std::vector;
    use std::option;
    use aptos_framework::event;
    use aptos_framework::account;

    const ROCK: u8 = 1;
    const SCISSORS: u8 = 2;
    const PAPER: u8 = 3;
    const ECodeForAllErrors: u64 = 10;
    const EInvalidID: u64 = 11;

    struct State has key {
        games: vector<Game>,
        players: simple_map::SimpleMap<address, u64>,
        online: vector<address>
    }

    struct Game has store, copy, drop {
        id: u64,
        player1: option::Option<address>,
        player1_move: u8,
        player1_score: u8,
        player2: option::Option<address>,
        player2_move: u8,
        player2_score: u8,
        result: u8,
        round: u8
    }


    struct GameEvents has key {
        new_game: event::EventHandle<GameStartedEvent>,

    }


    // __________________________Events___________________________
    struct GameStartedEvent has store,drop {
    player: address,
    game_id: u64,
}

    // ______________________________________________Entry Functons______________________________________

    fun init_module(admin: &signer) {
        let state = State {
            games: vector::empty<Game>(),
            players: simple_map::new(),
            online: vector::empty<address>()
        };

        let events = GameEvents {
            new_game: account::new_event_handle<GameStartedEvent>(admin)
        };
        move_to(admin, state);
        move_to(admin,events)
    }

    public entry fun start_game(account: &signer) acquires State, GameEvents {

        let state = borrow_global_mut<State>(@owner);
        let player = signer::address_of(account);

        /*
        - add player and a score of 0 to the list of players only if the player is not on the list already
        - this means the player is a new player
        */

        if (!simple_map::contains_key(&state.players, &player)) {
            simple_map::add(&mut state.players, player, 0);
        };

        let game = Game {
            id: vector::length(&state.games),
            player1: option::some(player),
            player1_move: 0,
            player1_score: 0,
            player2: option::none(),
            player2_move: 0,
            player2_score: 0,
            result: 0,
            round: 1
        };
        let id = game.id;
        vector::push_back(&mut state.games, game);
         // Emit event with game ID
        let events =  borrow_global_mut<GameEvents>(@owner);
        event::emit_event(
            &mut events.new_game,
            GameStartedEvent {
                player,
                game_id:id
            }
        );
    }

    public entry fun join_game(account: &signer, id: u64) acquires State {

        let state = borrow_global_mut<State>(@owner);

        /*
        - add player and a score of 0 to the list of players only if the player is not on the list already
        - this means the player is a new player
        */
        let player_2 = signer::address_of(account);
        if (!simple_map::contains_key(&state.players, &player_2)) {
            simple_map::add(&mut state.players, player_2, 0);
        };

        // Add Player2 to the game.
        let game = get_game(&mut state.games, id);
        assert!(option::is_some(&game.player1), ECodeForAllErrors);
        game.player2 = option::some(player_2);

    }

    public entry fun add_computer(id: u64) acquires State {

        let state = borrow_global_mut<State>(@owner);
        let game = get_game(&mut state.games, id);
        assert!(option::is_some(&game.player1), ECodeForAllErrors);
        assert!(option::is_none(&game.player2), ECodeForAllErrors);

        game.player2 = option::some(@owner);

    }

    public entry fun set_player_move(
        account: &signer, player_move: u8, id: u64
    ) acquires State {
        let state = borrow_global_mut<State>(@owner);
        let player_address = signer::address_of(account);
        //  {
        let game = get_game(&mut state.games, id);

        assert!(
            option::borrow(&game.player1) == &player_address
                || option::borrow(&game.player2) == &player_address,
            ECodeForAllErrors
        );

        if (option::borrow(&game.player1) == &player_address) {
            game.player1_move = player_move;
        } else if (option::borrow(&game.player2) == &player_address) {
            game.player2_move = player_move;
        };
        //  };
        if (game.player2_move != 0 && game.player1_move != 0) {
            update_game_result(state, id);

        }
    }

    public entry fun next_round(id: u64) acquires State {
        let state = borrow_global_mut<State>(@owner);
        let game = get_game(&mut state.games, id);
        game.round = game.round + 1;
        game.player1_move = 0;
        game.player2_move = 0;
        game.result = 0;

    }
    public entry fun restart_game(id: u64) acquires State {
        let state = borrow_global_mut<State>(@owner);
        let game = get_game(&mut state.games, id);
        game.round = 1;
        game.player1_move = 0;
        game.player2_move = 0;
        game.result = 0;
        game.player1_score = 0;
        game.player2_score = 0;

    }

    public entry fun add_player_online(player: &signer) acquires State {
        let state = borrow_global_mut<State>(@owner);
        let player_address = signer::address_of(player);
        if(vector::contains(&state.online, &player_address))return;
        vector::push_back(&mut state.online, player_address)
    }

    public entry fun remove_player_online(player: &signer) acquires State {
        let state = borrow_global_mut<State>(@owner);
        let player_address = signer::address_of(player);
        assert!(vector::contains(&state.online, &player_address), ECodeForAllErrors);

        let (found, i) = vector::find<address>(
            &state.online,
            |elem| { elem == &player_address }
        );

        assert!(found, ECodeForAllErrors);

        let _ = vector::remove(&mut state.online, i);
    }

    #[randomness]
    entry fun randomly_set_computer_move(id: u64) acquires State {
        let state = borrow_global_mut<State>(@owner);

        {
            let game = get_game(&mut state.games, id);
            randomly_set_computer_move_internal(game);
        };

        update_game_result(state, id);
    }

    // public entry fun finalize_game_results(account: &signer) acquires Game {
    //     let game = borrow_global_mut<Game>(signer::address_of(account));
    //     game.result = determine_winner(game.player_move, game.computer_move);
    // }

    // ______________________________________________View Functons______________________________________

    // Return games where player 1 is online and there isnt a player 2
    #[view]
    public fun get_waiting_list(): vector<Game> acquires State {
        let state = borrow_global<State>(@owner);
        let waiting = vector::empty<Game>();
        vector::for_each_ref(
            &state.games,
            |elem| {
                let item: Game = *elem;
                if (option::is_none(&item.player2)
                    && vector::contains(&state.online, option::borrow(&item.player1)))
                    vector::push_back(&mut waiting, item);
            }
        );
        waiting

    }

    #[view]
    public fun view_game(id: u64): Game acquires State {
        let state = borrow_global<State>(@owner);
        let (found, i) = vector::find<Game>(
            &state.games,
            |elem| {
                let item: &Game = elem;
                &item.id == &id
            }
        );

        assert!(found, ECodeForAllErrors);

        let game = vector::borrow(&state.games, i);
        *game
    }

    #[view]
    public fun get_player_score(account_addr: address): u64 acquires State {
        let state = borrow_global_mut<State>(@owner);
        if(simple_map::contains_key(&state.players, &account_addr)){

        let score = simple_map::borrow(&state.players, &account_addr);
        *score
        }else{
            0
        }
        
    }

    // -------Helper Functions-------
    fun get_game(games: &mut vector<Game>, id: u64): &mut Game {

        let (found, i) = vector::find<Game>(
            &*games,
            |elem| {
                let item: &Game = elem;
                &item.id == &id
            }
        );

        assert!(found, EInvalidID);

        let game = vector::borrow_mut(games, i);
        game
    }
    // fun get_events():&mut GameEvents acquires GameEvents{
    //     borrow_global_mut<GameEvents>(@owner)
    //     }

    fun determine_winner(state: &mut State, id: u64): u8 {
        let player1_addr = {
            let game = get_game(&mut state.games, id);
            // Extract player1 address first before using `state.players`
            option::extract(&mut game.player1)
        };

        let player2_addr = {
            let game = get_game(&mut state.games, id);
            // Extract player2 address similarly
            option::extract(&mut game.player2)
        };
        if(!simple_map::contains_key(&state.players, &player2_addr)){
            simple_map::add(&mut state.players, player2_addr,0);    
            };
        // Now that the mutable borrows of `game` have been released, check players
        assert!(
            simple_map::contains_key(&state.players, &player1_addr), ECodeForAllErrors
        );
        assert!(
            simple_map::contains_key(&state.players, &player2_addr), ECodeForAllErrors
        );

        let player_1_score = simple_map::borrow_mut(&mut state.players, &player1_addr);

        let game = get_game(&mut state.games, id);

        if (game.player1_move == ROCK && game.player2_move == SCISSORS) {
            game.player1_score = game.player1_score + 1;
            *player_1_score = *player_1_score + 1;
            option::fill(&mut game.player1, player1_addr);
            option::fill(&mut game.player2, player2_addr);
            1 // player wins
        } else if (game.player1_move == PAPER && game.player2_move == ROCK) {
            game.player1_score = game.player1_score + 1;
            *player_1_score = *player_1_score + 1;
            option::fill(&mut game.player1, player1_addr);
            option::fill(&mut game.player2, player2_addr);
            1 // player wins
        } else if (game.player1_move == SCISSORS && game.player2_move == PAPER) {
            game.player1_score = game.player1_score + 1;
            *player_1_score = *player_1_score + 1;
            option::fill(&mut game.player1, player1_addr);
            option::fill(&mut game.player2, player2_addr);
            1 // player wins
        } else if (game.player1_move == game.player2_move) {
            option::fill(&mut game.player1, player1_addr);
            option::fill(&mut game.player2, player2_addr);
            3 // draw
        } else {
            game.player2_score = game.player2_score + 1;
            let player_2_score = simple_map::borrow_mut(&mut state.players, &player2_addr);
            *player_2_score = *player_2_score + 1;
            option::fill(&mut game.player1, player1_addr);
            option::fill(&mut game.player2, player2_addr);
            2 // computer wins
        }
    }

    fun update_game_result(state: &mut State, id: u64) {

        // if (game.player2_move != 0 && game.player1_move != 0) {
        let result = determine_winner(state, id);
        let game = get_game(&mut state.games, id);
        game.result = result;
        // } else {
        // abort 0
        // }
    }

    public(friend) fun randomly_set_computer_move_internal(
        game: &mut Game
    ) {

        let random_number = randomness::u8_range(1, 4);
        game.player2_move = random_number;
    }

    // --------------------------Tests---------------------------
    #[test]
    fun test_init_module_success() acquires State {
        let admin = account::create_account_for_test(@owner);
        init_module(&admin);
        let state = borrow_global<State>(@owner);
        assert!(vector::length(&state.games) == 0, ECodeForAllErrors);
    }

    #[test(user1 = @0x2)]
    fun test_start_game(user1: &signer) acquires State,GameEvents {
        let admin = account::create_account_for_test(@owner);
        init_module(&admin);

        // Start a game as user1
        start_game(user1);

        let state = borrow_global<State>(@owner);

        let game = vector::borrow(&state.games, 0);
        assert!(
            option::borrow(&game.player1) == &signer::address_of(user1), ECodeForAllErrors
        );
        assert!(option::is_none(&game.player2), ECodeForAllErrors);
        assert!(game.player1_move == 0, ECodeForAllErrors);
    }

    #[test(user1 = @0x2, user2 = @0x3)]
    fun test_join_game(user1: &signer, user2: &signer) acquires State, GameEvents {
        let admin = account::create_account_for_test(@owner);
        init_module(&admin);

        // Start a game as user1
        start_game(user1);

        // Join the game as user2
        join_game(user2, 0);

        let state = borrow_global<State>(@owner);
        let game = vector::borrow(&state.games, 0);

        assert!(
            option::borrow(&game.player2) == &signer::address_of(user2), ECodeForAllErrors
        );
    }

    #[test(user1 = @0x2, user2 = @0x3)]
    fun test_set_moves(user1: &signer, user2: &signer) acquires State,GameEvents {
        let admin = account::create_account_for_test(@owner);
        init_module(&admin);

        // Start a game and join
        start_game(user1);
        join_game(user2, 0);

        // Set moves for both players
        set_player_move(user1, ROCK, 0);
        set_player_move(user2, SCISSORS, 0);

        let state = borrow_global<State>(@owner);
        let game = vector::borrow(&state.games, 0);

        assert!(game.player1_move == ROCK, ECodeForAllErrors);
        assert!(game.player2_move == SCISSORS, ECodeForAllErrors);
        assert!(game.result == 1, ECodeForAllErrors); // Player 1 wins
    }

    #[test(user1 = @0x2, user2 = @0x3)]
    fun test_next_round(user1: &signer, user2: &signer) acquires State, GameEvents {
        let admin = account::create_account_for_test(@owner);
        init_module(&admin);

        // Start game and set moves
        start_game(user1);
        join_game(user2, 0);
        set_player_move(user1, ROCK, 0);
        set_player_move(user2, SCISSORS, 0);

        // Move to next round
        next_round(0);

        let state = borrow_global<State>(@owner);
        let game = vector::borrow(&state.games, 0);

        assert!(game.round == 2, ECodeForAllErrors);
        assert!(game.player1_move == 0, ECodeForAllErrors); // Reset moves
        assert!(game.player2_move == 0, ECodeForAllErrors); // Reset moves
    }

    #[test(user1 = @0x2)]
    fun test_add_computer(user1: &signer) acquires State, GameEvents {
        let admin = account::create_account_for_test(@owner);
        init_module(&admin);

        // Start a game as user1
        start_game(user1);

        // Add computer to the game
        add_computer(0);

        let state = borrow_global<State>(@owner);
        let game = vector::borrow(&state.games, 0);

        assert!(option::borrow(&game.player2) == &@owner, ECodeForAllErrors);
    }

    // #[test(user1 = @0x2)]
    // fun test_random_computer_move(user1: &signer) acquires State {
    //     let admin = account::create_account_for_test(@owner);
    //     init_module(&admin);

    //     // Start a game and add computer
    //     start_game(user1);
    //     add_computer(0);

    //     // Set player move and random computer move
    //     set_player_move(user1, ROCK, 0);
    //     randomly_set_computer_move(0);

    //     let state = borrow_global<State>(@owner);
    //     let game = vector::borrow(&state.games, 0);

    //     assert!(game.player2_move != 0, ECodeForAllErrors);  // Ensure computer move is set
    // }

    #[test(user1 = @0x2)]
    #[expected_failure(abort_code = EInvalidID)]

    fun test_invalid_game_id(user1: &signer) acquires State,GameEvents {
        let admin = account::create_account_for_test(@owner);
        init_module(&admin);

        // Start a game
        start_game(user1);

        // Attempt to join non-existing game
        join_game(user1, 999); // Invalid ID
    }

    #[test(user1 = @0x2)]
    fun test_add_player_online(user1: &signer) acquires State {
        let admin = account::create_account_for_test(@owner);
        init_module(&admin);

        // Add user1 to the online players list
        add_player_online(user1);
        add_player_online(user1);

        let state = borrow_global<State>(@owner);

        // Check that user1 is in the online players list
        assert!(
            vector::contains(&state.online, &signer::address_of(user1)),
            ECodeForAllErrors
        );
    }

    #[test(user1 = @0x2)]
    fun test_remove_player_online(user1: &signer) acquires State {
        let admin = account::create_account_for_test(@owner);
        init_module(&admin);

        // Add user1 to the online players list and then remove them
        add_player_online(user1);
        remove_player_online(user1);

        let state = borrow_global<State>(@owner);

        // Check that user1 is no longer in the online players list
        assert!(
            !vector::contains(&state.online, &signer::address_of(user1)),
            ECodeForAllErrors
        );
    }

    #[test(user1 = @0x2)]
    #[expected_failure(abort_code = ECodeForAllErrors)]
    fun test_remove_nonexistent_player_online(user1: &signer) acquires State {
        let admin = account::create_account_for_test(@owner);
        init_module(&admin);

        // Try to remove a player who is not in the online players list
        remove_player_online(user1); // Should fail
    }

    #[test(user1 = @0x2, user2 = @0x3)]
    fun test_get_waiting_list(user1: &signer, user2: &signer) acquires State, GameEvents {
        let admin = account::create_account_for_test(@owner);
        init_module(&admin);

        // Start a game as user1 and add user1 to the online players list
        start_game(user1);
        add_player_online(user1);

        // Verify the game is in the waiting list (since player2 has not joined yet and player1 is online)
        let waiting_list = get_waiting_list();
        assert!(vector::length(&waiting_list) == 1, ECodeForAllErrors);

        let waiting_game = vector::borrow(&waiting_list, 0);
        assert!(
            option::borrow(&waiting_game.player1) == &signer::address_of(user1),
            ECodeForAllErrors
        );
        assert!(option::is_none(&waiting_game.player2), ECodeForAllErrors);

        // Now remove user1 from the online players list
        remove_player_online(user1);

        // Verify that the waiting list is empty (since player1 is no longer online)
        let updated_waiting_list = get_waiting_list();
        assert!(vector::length(&updated_waiting_list) == 0, ECodeForAllErrors);

        // Add user1 back to the online players list
        add_player_online(user1);

        // Now let user2 join the game
        join_game(user2, 0);

        // Verify that the waiting list is empty (since the game now has two players)
        let final_waiting_list = get_waiting_list();
        assert!(vector::length(&final_waiting_list) == 0, ECodeForAllErrors);
    }

    #[test(user1 = @0x2)]
fun test_game_event_emission(user1: &signer) acquires State, GameEvents {
    let admin = account::create_account_for_test(@owner);
    init_module(&admin);

    // Start a game as user1
    start_game(user1);

    // Check the state to ensure that the game started correctly
    let state = borrow_global<State>(@owner);
    let game = vector::borrow(&state.games, 0);
    assert!(
        option::borrow(&game.player1) == &signer::address_of(user1), ECodeForAllErrors
    );

   
}

}
}

