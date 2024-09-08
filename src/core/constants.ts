// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const LocalStorageKeys = {
  keylessAccounts: "@aptos-connect/keyless-accounts",
};

export const devnetClient = new Aptos(
  new AptosConfig({ network: Network.DEVNET })
);

/// FIXME: Put your client id here
export const GOOGLE_CLIENT_ID =
  "1463010045-5pe6vqtrrtk8oamqs47n0ln0avo8rebs.apps.googleusercontent.com";

export const MODULE_ADD =
  "0xc03556bd82d64b147b985e1473601aa2df75ddfc398043f431b0460e2a05ada1";
