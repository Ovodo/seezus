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
import { addPlayerOnline, aptos, joinGame, startGame } from "../contract/entry";
import { getWaitingList } from "../contract/view";
import { useNavigate } from "react-router-dom";
import SmallButton from "../components/SmallButton";
import toast from "react-hot-toast";
import { getPlayerScore } from "../contract/view";

const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");

const Home = () => {
  const { activeAccount } = useKeylessAccounts();
  const [waiting, setWaiting] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!activeAccount) {
      navigate("/");
    } else {
      fetchBalance();
      fetchDetails();
    }
  }, [activeAccount, navigate]);

  const fetchBalance = async () => {
    if (activeAccount) {
      try {
        const resources: any[] = await client.getAccountResources(
          HexString.ensure(activeAccount.accountAddress.toString())
        );
        const accountResource = resources.find(
          (r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
        );

        if (accountResource) {
          const balanceValue = (accountResource.data as any).coin.value;
          setBalance(balanceValue ? parseInt(balanceValue) / 100000000 : 0); // Convert from Octas to APT
        } else {
          setBalance(0);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  const fetchDetails = async () => {
    const wait = await getWaitingList();
    const playerScore = await getPlayerScore(
      activeAccount?.accountAddress.toString() as string
    );
    setWaiting(wait);
    setScore(playerScore);
  };

  async function faucet(signer: KeylessAccount) {
    try {
      toast.loading("Fetching Test APT", { duration: 1000 });
      await fetchBalance();
      if (balance < 1 || balance == undefined || balance == 0) {
        const res = await aptos.fundAccount({
          accountAddress: signer.accountAddress.toString(),
          amount: 100_000_000,
        });
        console.log("result", res);
        toast.success("Successful");
      } else {
        toast.success("Enough APT already");
      }
    } catch (e) {
      console.log("error", e);
      toast.error("Failed");
    }
  }

  async function startNewGame() {
    try {
      toast.loading("Initializing", { duration: 3000 });
      const id = await startGame(activeAccount as KeylessAccount);
      navigate("/game", { state: { id } });
    } catch (error) {
      console.error(error);
      toast.error("Failed to start new game");
    }
  }
  return (
    <main className='flex h-screen min-w-screen w-screen bg-primary relative flex-col items-center justify-between p-24'>
      <img
        src={"/images/home.svg"}
        className='object-cover absolute top-0 left-0 w-screen bord h-screen'
        alt='Main'
      />
      <img
        src={"/icons/arrow.svg"}
        className='absolute top-[42%] animate-bounce duration-1000 left-[2%]'
        width={32}
        height={0}
        alt='Arr'
      />

      <Button
        click={startNewGame}
        Title='New'
        style='absolute text-3xl top-1/2 px-[5vw] left-[3%]'
      />

      {/* Right Section */}
      <motion.div
        initial={{ x: 500 }}
        animate={{ x: 0 }}
        transition={{ duration: 3 }}
        className='absolute flex p-6  flex-col items-center right-0 top-0 h-full bg-appLight w-[28%]'
      >
        <p className='text-secondary my-6 text-2xl font-semibold'>
          {waiting.length == 0
            ? "No Players currently in the lobby, check back later"
            : " Player One is waiting for you, hurry and wrap him up."}
        </p>

        {/* <Button
          Title='Join'
          click={() => startGame(activeAccount as KeylessAccount)}
          style='px-[5vw] mt-12 text-3xl z-50 '
        /> */}

        <div className='flex flex-col mt-6 h-[70%] overflow-y-scroll w-full gap-6 p-6 '>
          {waiting.map((item, index) => {
            return (
              <button
                onClick={() => {
                  joinGame(activeAccount as KeylessAccount, item?.id as number);
                  navigate("/game", { state: { id: item?.id } });
                }}
                key={item?.id.toString()}
                className='text-xl bg-secondary/30 flex justify-between items-center p-2 rounded-lg w-full hover:-translate-x-1 duration-150 cursor-pointer text-secondary_dark font-medium'
              >
                <p>
                  {activeAccount &&
                    collapseAddress(activeAccount.accountAddress.toString())}
                </p>
                <p>{`Game ${item?.id}`}</p>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Balance and Function to fetch test APT */}
      <motion.div
        initial={{ y: -500 }}
        animate={{ y: 0 }}
        transition={{ duration: 3 }}
        className='absolute top-[17%] -translate-x-1/2  bg-whit p-2 rounded-md  flex w-[25%] justify-between items-center'
      >
        {activeAccount && (
          <p className='text-3xl  text-secondary_dark font-extrabold'>
            {`Bal:${balance.toFixed(2)} APT`}
          </p>
        )}
        <SmallButton
          Title='Faucet'
          style='px-[3vw]'
          click={() => faucet(activeAccount as KeylessAccount)}
        />
      </motion.div>
      {/* User and Score */}
      <motion.div
        initial={{ y: 500 }}
        animate={{ y: 0 }}
        transition={{ duration: 3 }}
        className='absolute bottom-[13%] border border-secondary_light  -translate-x-1/2 bor bg-whit p-2 rounded-md  flex w-[25%] justify-between items-center'
      >
        {activeAccount && (
          <p className='text-3xl  text-secondary_dark font-extrabold'>
            {collapseAddress(activeAccount.accountAddress.toString())}
          </p>
        )}
        <p className='text-2xl text-secondary_dark font-extrabold'>{`Score: ${score}`}</p>
      </motion.div>
    </main>
  );
};

export default Home;
