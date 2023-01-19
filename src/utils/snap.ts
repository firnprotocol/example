import { defaultSnapOrigin } from "../config";
import { GetSnapsResponse, Snap } from "../types";
import { ethers } from "ethers";
import { FIRN_TOKEN, ROUTER_ADDRESS, WRAPPED_ETHER } from "../constants/addresses";
import { ROUTER_ABI } from "../constants/abis";

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<"version" | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: "wallet_enable",
    params: [
      {
        wallet_snap: {
          [snapId]: { // "npm:@firnprotocol/snap":
            params,
          },
        },
      },
    ],
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (
  version?: string
): Promise<Snap | undefined> => {
  try {
    const snaps = await window.ethereum.request({
      method: "wallet_getSnaps",
    }) as unknown as GetSnapsResponse;

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (error) {
    console.log("Failed to obtain installed snap", error);
    return undefined;
  }
};

export const handleInitialize = async () => {
  await window.ethereum.request({
    method: "wallet_invokeSnap",
    params: [
      defaultSnapOrigin,
      {
        method: "initialize",
      },
    ],
  });
}

export const handleBalance = async () => {
  return await window.ethereum.request({ // might throw; will be handled above
    method: "wallet_invokeSnap",
    params: [
      defaultSnapOrigin,
      {
        method: "requestBalance",
      },
    ],
  });
}

export const handleTransact = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await provider.listAccounts();
  const { chainId } = await provider.getNetwork();
  if (chainId !== 1) throw new Error("This method is designed to buy 0.100 ETH of FIRN token. You have to be connected to mainnet to invoke it.");
  const router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, provider);
  const amount = ethers.utils.parseUnits("0.1", "ether");
  const unsignedTx = await router.populateTransaction.exactInputSingle(
    {
      tokenIn: WRAPPED_ETHER,
      tokenOut: FIRN_TOKEN,
      fee: 3000,
      recipient: accounts[0], // send proceeds to logged-in account
      amountIn: amount,
      amountOutMinimum: ethers.BigNumber.from(0),
      sqrtPriceLimitX96: ethers.BigNumber.from(0),
    }, {
      value: amount,
    }
  );

  return await window.ethereum.request({ // might throw; will be handled above
    method: "wallet_invokeSnap",
    params: [
      defaultSnapOrigin,
      {
        method: "transact",
        params: unsignedTx,
      },
    ],
  });
};