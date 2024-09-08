import { motion } from "framer-motion";
import { useKeylessAccounts } from "../core/useKeylessAccounts";
import { useEffect, useState } from "react";
import { collapseAddress } from "../core/utils";
import { AptosClient, HexString } from "aptos";
import {
  Aptos,
  AptosConfig,
  KeylessAccount,
  Network,
} from "@aptos-labs/ts-sdk";
import Button from "../components/Button";
import SmallButton from "../components/SmallButton";
import { Choose } from "../components/Choose";
import { useNavigate, useLocation } from "react-router-dom";
import {
  addComputer,
  addPlayerOnline,
  nextRound,
  removePlayerOnline,
  setComputerMove,
  setPlayerMove,
} from "../contract/entry";
import { getGame } from "../contract/view";
import toast from "react-hot-toast";
import { HashLoader } from "react-spinners";
import { MODULE_ADD } from "../core/constants";
import OutsideClick from "react-outside-click-handler";

const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");

const Game = () => {
  const [game, setGame] = useState<any>(null);
  const [player1_choice, setPlayer1Choice] = useState<number[]>([1, 2, 3]);
  const [player2_choice, setPlayer2Choice] = useState<number[]>([1, 2, 3]);
  const [loading, setLoading] = useState(true);

  const { activeAccount } = useKeylessAccounts();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const isFilled = game?.player2.vec.length == 1;

  const retrieveGame = async () => {
    try {
      let res = await getGame(id);
      setGame(res);

      // Set player's choice
      if (res.player1_move !== 0) {
        setPlayer1Choice([res.player1_move]);
      }
      if (res.player2_move !== 0) {
        setPlayer2Choice([res.player2_move]);
      }

      // Set winner of the game
      switch (res.result) {
        case 1:
          toast.success(`Player 1 wins round ${res.round}`);
          break;
        case 2:
          toast.success(`Player 2 wins round ${res.round}`);
          break;
        case 3:
          toast(`Round ${res.round} ends in a draw`);
          break;
        default:
          break;
      }
      setLoading(false); // Set loading to false once the game data is fetched
      return res;
    } catch (error) {
      console.error(error);
      toast.error("Failed to get game");
      setLoading(false); // Ensure loading is disabled on error
    }
  };

  const addComp = async () => {
    try {
      toast.loading("Wait...", { duration: 3000 });
      await addComputer(activeAccount as KeylessAccount, id);
      retrieveGame();
      toast.success("Computer Added!!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to Add Comp");
    }
  };

  useEffect(() => {
    if (!activeAccount) {
      navigate("/");
    } else {
      addPlayerOnline(activeAccount);
    }
    retrieveGame();

    const refresh = setInterval(() => {
      retrieveGame();
      if (game?.player1.vec.length != 0 && game?.player2?.vec.length != 0) {
        clearInterval(refresh);
      }
    }, 3000);

    return () => {
      removePlayerOnline(activeAccount as KeylessAccount);
      clearInterval(refresh);
    };
  }, [activeAccount, navigate]);

  // Display loading state until the game data is fetched
  if (loading || !game || !activeAccount) {
    console.log(loading, game, activeAccount);
    return (
      <div className='flex h-screen text-secondary_dark w-screen gap-6 items-center justify-center'>
        <HashLoader loading={loading} />
        <p className='text-3xl'>Loading game...</p>
      </div>
    );
  }
  const isPlayer1 =
    HexString.ensure(
      activeAccount.accountAddress.toString()
    ).toShortString() === game.player1.vec[0];
  const isPlayer2 =
    HexString.ensure(
      activeAccount.accountAddress.toString()
    ).toShortString() === game.player2.vec[0];
  const isComputer = MODULE_ADD === game.player2.vec[0];

  const setMove = async () => {
    try {
      toast.loading("Wait...", { duration: 1000 });
      await setPlayerMove(
        activeAccount as KeylessAccount,
        id,
        isPlayer1 ? player1_choice[0] : player2_choice[0]
      );
      if (isComputer) {
        // console.log("setting comp");
        toast.loading("Calculating...", { duration: 3000 });
        await setComputerMove(activeAccount as KeylessAccount, id);
      }
      retrieveGame();
    } catch (error) {
      toast.error("Failed to set move");
    }
  };

  return (
    <main className='flex h-screen  min-w-screen w-screen bg-primary relative flex-col items-center justify-between'>
      <h4 className='absolute text-secondary translate-x-14 font-extrabold top-1 self-center text-2xl'>{`Game: ${id}`}</h4>
      <motion.div
        initial={{ y: -400 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 100, duration: 2 }}
        className='w-full h-[45%] flex flex-row-reverse  bg-appLight'
      >
        <div className='w-1/2 border-l border-secondary m-1 flex flex-col items-center justify-center'>
          <p className='text-3xl'>Player 2</p>
          <p className='text-3xl'>
            {game.player2 && collapseAddress(game.player2.vec[0] ?? "")}
          </p>
        </div>
        <OutsideClick
          display='contents'
          onOutsideClick={() => setPlayer2Choice([1, 2, 3])}
        >
          <div className='w-1/2 flex flex-col relative justify-center items-center '>
            {player2_choice.length == 1 && isPlayer2 && (
              <SmallButton
                Title='Confirm'
                click={() => setMove()}
                style='px-[3vw] absolute top-4 left-4  text-xl'
              />
            )}
            {isFilled ? (
              <div className='w-full  h-full relative'>
                {isPlayer2 ? (
                  <Choose
                    choices={player2_choice}
                    setChoices={setPlayer2Choice}
                  />
                ) : (
                  <div className='relative w-full h-full'>
                    <Choose
                      choices={player2_choice}
                      setChoices={setPlayer2Choice}
                    />
                    <div className='absolute top-0 left-0 right-0 bottom-0 w-full h-full  bg-secondary_dark/10 z-50' />
                  </div>
                )}
              </div>
            ) : (
              <div className='flex flex-col items-center gap-4'>
                <p>Waiting...</p>
                <p>For Player 2 to join </p>
                <p>Click to play with computer</p>
                <Button
                  click={() => addComp()}
                  Title='Computer'
                  style='px-[4vw] mt-4 bg-red-400 text-2xl'
                />
              </div>
            )}
          </div>
        </OutsideClick>
      </motion.div>
      <div className='flex w-full items-center px-6 justify-between  flex-1 relative'>
        <Button
          Title='Next Round'
          click={() => {
            nextRound(activeAccount as KeylessAccount, id);
            retrieveGame();
          }}
          style='px-[3vw] h-[45px]'
        />
        <h3 className='text-5xl absolute self-center left-1/2 -translate-x-1/2 text-secondary font-black'>
          Vs
        </h3>
        <p className='text-3xl font-extrabold text-secondary_dark text-right px-5 uppercase w-1/2'>
          Round {game.round}
        </p>
      </div>
      <div className='w-full h-[45%] flex  bg-secondary_light'>
        <div className='w-1/2 flex flex-col items-center justify-center m-1 border-r border-appLight'>
          <div className='flex flex-col items-center'>
            <p className='text-3xl'>Player 1</p>
            <p className='text-3xl'>
              {activeAccount &&
                collapseAddress(activeAccount.accountAddress.toString())}
            </p>
          </div>
        </div>
        <OutsideClick
          display='contents'
          onOutsideClick={() => setPlayer1Choice([1, 2, 3])}
        >
          <div className='w-1/2 h-full bord relative'>
            {isPlayer1 ? (
              <Choose choices={player1_choice} setChoices={setPlayer1Choice} />
            ) : (
              <div className='relative w-full h-full'>
                <Choose
                  choices={player1_choice}
                  setChoices={{ setPlayer1Choice }}
                />
                <div className='absolute top-0 left-0 right-0 bottom-0 w-full h-full  bg-secondary_dark/10 z-50' />
              </div>
            )}

            {player1_choice.length == 1 && isPlayer1 && (
              <SmallButton
                Title='Confirm'
                click={() => setMove()}
                style='px-[3vw] absolute bottom-4 right-4  text-xl'
              />
            )}
          </div>
        </OutsideClick>
      </div>
    </main>
  );
};

export default Game;
