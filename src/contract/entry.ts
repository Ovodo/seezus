import { MODULE_ADD } from "../core/constants";
import {
  Aptos,
  AptosConfig,
  InputViewFunctionData,
  KeylessAccount,
  ModuleId,
  Network,
} from "@aptos-labs/ts-sdk";
import { AptosClient, HexString } from "aptos";
import toast from "react-hot-toast";

// Initialize Aptos Client

const client = new AptosClient("https://fullnode.testnet.aptoslabs.com");
export const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET })); // Configure your network here

export async function removePlayerOnline(signer: KeylessAccount) {
  console.log("Calling add player");

  const payload: any = {
    type: "entry_function_payload",
    function: `${MODULE_ADD}::Seezus::remove_player_online`,
    typeArguments: [],
    functionArguments: [], // No arguments required
  };
  // Sign and submit transaction

  const transaction = await aptos.transaction.build.simple({
    sender: signer.accountAddress.toString(),
    data: payload,
  });
  const committedTxn = aptos.transaction.sign({ signer, transaction });

  const committedTransactionResponse = await aptos.transaction.submit.simple({
    transaction,
    senderAuthenticator: committedTxn,
  });

  // 5. Wait for results
  console.log("\n=== 5. Waiting for result of transaction ===\n");
  const executedTransaction = await aptos.waitForTransaction({
    transactionHash: committedTransactionResponse.hash,
  });
}
export async function addPlayerOnline(signer: KeylessAccount) {
  console.log("Calling add player");

  const payload: any = {
    type: "entry_function_payload",
    function: `${MODULE_ADD}::Seezus::add_player_online`,
    typeArguments: [],
    functionArguments: [], // No arguments required
  };
  // Sign and submit transaction

  const transaction = await aptos.transaction.build.simple({
    sender: signer.accountAddress.toString(),
    data: payload,
  });
  const committedTxn = aptos.transaction.sign({ signer, transaction });

  const committedTransactionResponse = await aptos.transaction.submit.simple({
    transaction,
    senderAuthenticator: committedTxn,
  });

  // 5. Wait for results
  console.log("\n=== 5. Waiting for result of transaction ===\n");
  const executedTransaction = await aptos.waitForTransaction({
    transactionHash: committedTransactionResponse.hash,
  });
}
export async function startGame(
  signer: KeylessAccount
): Promise<number | undefined> {
  console.log("Calling add player");

  const payload: any = {
    type: "entry_function_payload",
    function: `${MODULE_ADD}::Seezus::start_game`,
    typeArguments: [],
    functionArguments: [], // No arguments required
  };
  // Sign and submit transaction

  try {
    const transaction = await aptos.transaction.build.simple({
      sender: signer.accountAddress.toString(),
      data: payload,
    });
    const committedTxn = aptos.transaction.sign({ signer, transaction });

    const committedTransactionResponse = await aptos.transaction.submit.simple({
      transaction,
      senderAuthenticator: committedTxn,
    });

    // 5. Wait for results
    console.log("\n=== 5. Waiting for result of transaction ===\n");
    const executedTransaction = (await aptos.waitForTransaction({
      transactionHash: committedTransactionResponse.hash,
    })) as any;

    //return the game_id from the events emitted.
    return executedTransaction.events[0].data.game_id as number;
  } catch (error) {
    console.error(error);
  }
}
export async function addComputer(
  signer: KeylessAccount,
  id: number
): Promise<void> {
  console.log("Calling add player");

  const payload: any = {
    type: "entry_function_payload",
    function: `${MODULE_ADD}::Seezus::add_computer`,
    typeArguments: [],
    functionArguments: [id], // No arguments required
  };
  // Sign and submit transaction

  try {
    const transaction = await aptos.transaction.build.simple({
      sender: signer.accountAddress.toString(),
      data: payload,
    });
    const committedTxn = aptos.transaction.sign({ signer, transaction });

    const committedTransactionResponse = await aptos.transaction.submit.simple({
      transaction,
      senderAuthenticator: committedTxn,
    });

    // 5. Wait for results
    console.log("\n=== 5. Waiting for result of transaction ===\n");
    const executedTransaction = (await aptos.waitForTransaction({
      transactionHash: committedTransactionResponse.hash,
    })) as any;

    //return the game_id from the events emitted.
  } catch (error) {
    console.error(error);
  }
}

export async function joinGame(
  signer: KeylessAccount,
  id: number
): Promise<void> {
  console.log("Calling join game");

  const payload: any = {
    type: "entry_function_payload",
    function: `${MODULE_ADD}::Seezus::join_game`,
    typeArguments: [],
    functionArguments: [id], // No arguments required
  };
  // Sign and submit transaction

  try {
    toast.loading("Joining...", { duration: 2000 });
    const transaction = await aptos.transaction.build.simple({
      sender: signer.accountAddress.toString(),
      data: payload,
    });
    const committedTxn = aptos.transaction.sign({ signer, transaction });

    const committedTransactionResponse = await aptos.transaction.submit.simple({
      transaction,
      senderAuthenticator: committedTxn,
    });

    // 5. Wait for results
    console.log("\n=== 5. Waiting for result of transaction ===\n");
    const executedTransaction = (await aptos.waitForTransaction({
      transactionHash: committedTransactionResponse.hash,
    })) as any;

    //return the game_id from the events emitted.
  } catch (error) {
    console.error(error);
  }
}
export async function setPlayerMove(
  signer: KeylessAccount,
  id: number,
  move: number
): Promise<void> {
  console.log("Calling set player move");

  const payload: any = {
    type: "entry_function_payload",
    function: `${MODULE_ADD}::Seezus::set_player_move`,
    typeArguments: [],
    functionArguments: [move, id], // No arguments required
  };
  // Sign and submit transaction

  try {
    const transaction = await aptos.transaction.build.simple({
      sender: signer.accountAddress.toString(),
      data: payload,
    });
    const committedTxn = aptos.transaction.sign({ signer, transaction });

    const committedTransactionResponse = await aptos.transaction.submit.simple({
      transaction,
      senderAuthenticator: committedTxn,
    });

    // 5. Wait for results
    console.log("\n=== 5. Waiting for result of transaction ===\n");
    const executedTransaction = (await aptos.waitForTransaction({
      transactionHash: committedTransactionResponse.hash,
    })) as any;

    //return the game_id from the events emitted.
  } catch (error) {
    console.error(error);
  }
}
export async function setComputerMove(
  signer: KeylessAccount,
  id: number
): Promise<void> {
  console.log("Calling computer move");

  const payload: any = {
    type: "entry_function_payload",
    function: `${MODULE_ADD}::Seezus::randomly_set_computer_move`,
    typeArguments: [],
    functionArguments: [id], // No arguments required
  };
  // Sign and submit transaction

  try {
    const transaction = await aptos.transaction.build.simple({
      sender: signer.accountAddress.toString(),
      data: payload,
    });
    const committedTxn = aptos.transaction.sign({ signer, transaction });

    const committedTransactionResponse = await aptos.transaction.submit.simple({
      transaction,
      senderAuthenticator: committedTxn,
    });

    // 5. Wait for results
    console.log("\n=== 5. Waiting for result of transaction ===\n");
    const executedTransaction = (await aptos.waitForTransaction({
      transactionHash: committedTransactionResponse.hash,
    })) as any;

    //return the game_id from the events emitted.
    console.log(executedTransaction);
  } catch (error) {
    console.error(error);
  }
}
export async function nextRound(
  signer: KeylessAccount,
  id: number
): Promise<void> {
  console.log("Calling computer move");

  const payload: any = {
    type: "entry_function_payload",
    function: `${MODULE_ADD}::Seezus::next_round`,
    typeArguments: [],
    functionArguments: [id], // No arguments required
  };
  // Sign and submit transaction

  try {
    toast.loading("Moving..", { duration: 1500 });
    const transaction = await aptos.transaction.build.simple({
      sender: signer.accountAddress.toString(),
      data: payload,
    });
    const committedTxn = aptos.transaction.sign({ signer, transaction });

    const committedTransactionResponse = await aptos.transaction.submit.simple({
      transaction,
      senderAuthenticator: committedTxn,
    });

    // 5. Wait for results
    console.log("\n=== 5. Waiting for result of transaction ===\n");
    const executedTransaction = (await aptos.waitForTransaction({
      transactionHash: committedTransactionResponse.hash,
    })) as any;

    //return the game_id from the events emitted.
    console.log(executedTransaction);
  } catch (error) {
    console.error(error);
  }
}
