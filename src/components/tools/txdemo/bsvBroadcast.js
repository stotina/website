import { broadcastTx as broadcastTxWoC } from "../../../assets/js/whatsOnChain.js";
import { getAddress, getNetwork } from "./bsvUtxo.js";

export async function broadcastTx(txhex, network = undefined) {
  network = network?.toString() || getNetwork()?.toString();

  try {
    return await broadcastTxWoC(txhex, network);
  } catch (error) {
    error.message += "\n Extra Information: " +
        JSON.stringify({ network, address: getAddress().toString(), tx: txhex })
    throw error;
  }
}
