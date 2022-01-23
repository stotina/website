import bsvjs from "../../assets/js/bsv.2.0.10/bsv.bundle"

export async function getRawTx(txid, network = "main") {
  console.debug("Get Raw TX: " + txid)
  const url = `https://api.whatsonchain.com/v1/bsv/${network}/tx/${txid}/hex`;
  const hex = await fetch(url).then((res) => res.text());
  console.debug("Raw TX is: " + hex)
  return hex;
}

export async function broadcastTx(txhex, network = "main") {
  const url = `https://api.whatsonchain.com/v1/bsv/${network}/tx/raw`;

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ txhex }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok)
    throw new Error(
      `Failed to broadcast TX to ${url}: ${(await res.text()) ||
        res.statusText}`
    );

  return await res.json();
}

export async function getUtxos(address, network = "main") {
  const url = `https://api.whatsonchain.com/v1/bsv/${network}/address/${address}/unspent`;
  const result = await fetch(url).then((res) => res.json());

  if (!Array.isArray(result))
    throw new Error(`Failed to GET ${url} : Data = ${JSON.stringify(result)}`);

  const addr =
    network === "main"
      ? bsvjs.Address.fromString(address.toString())
      : bsvjs.Address.Testnet.fromString(address.toString());
  const script = bsvjs.Script.fromPubKeyHash(addr.hashBuf);
  const scriptLen = bsvjs.VarInt.fromNumber(script.toBuffer().length);

  return result.map((i) => {
    const res = {
      txid: i.tx_hash,
      vout: i.tx_pos,
      value: i.value,
      height: i.height,
    };
    const out = new bsvjs.TxOut(new bsvjs.Bn(res.value), scriptLen, script);
    const txid = Buffer.from(res.txid, "hex").reverse();
    return { out, txid, vout: res.vout };
  });
}
