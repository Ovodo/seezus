import { MODULE_ADD } from "../core/constants";
import {
  Aptos,
  AptosConfig,
  InputViewFunctionData,
  KeylessAccount,
  Network,
} from "@aptos-labs/ts-sdk";
import { AptosClient, HexString } from "aptos";
import toast from "react-hot-toast";

// Initialize Aptos Client

const client = new AptosClient("https://fullnode.testnet.aptoslabs.com");
export const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET })); // Configure your network here

export async function getWaitingList(): Promise<any[]> {
  console.log("Calling add player");

  const payload: InputViewFunctionData = {
    // type: "view_function_payload",
    function: `${MODULE_ADD}::Seezus::get_waiting_list`,
    typeArguments: [],
    functionArguments: [], // No arguments required
  };
  // Sign and submit transaction

  const response = await aptos.view({
    payload,
  });

  console.log("response", response[0]);
  return response[0] as any[];
}
export async function getPlayerScore(address: string): Promise<any> {
  console.log("Calling add player");

  const payload: InputViewFunctionData = {
    // type: "view_function_payload",
    function: `${MODULE_ADD}::Seezus::get_player_score`,
    typeArguments: [],
    functionArguments: [address], // No arguments required
  };
  // Sign and submit transaction

  const response = await aptos.view({
    payload,
  });

  console.log("response", response[0]);
  return response[0];
}

export async function getGame(id: number): Promise<any> {
  console.log("Calling add player");

  const payload: InputViewFunctionData = {
    // type: "view_function_payload",
    function: `${MODULE_ADD}::Seezus::view_game`,
    typeArguments: [],
    functionArguments: [id], // No arguments required
  };
  // Sign and submit transaction

  const response = await aptos.view({
    payload,
  });

  console.log("response", response[0]);
  return response[0];
}
