import bsvjs from "../../../assets/js/bsv.2.0.10/bsv.bundle";

export function decodeTxParts(rawtx) {
  const tx = bsvjs.Tx.fromHex(rawtx);

  const parts = [];

  parts.push({
    type: "versionBytesNum",
    val: tx.versionBytesNum.toString(),
    buf: new bsvjs.Bw().writeUInt32LE(tx.versionBytesNum).toBuffer(),
  });

  parts.push({
    type: "txInsVi",
    val: tx.txInsVi.toBn().toString() + " input(s)",
    buf: tx.txInsVi.buf,
  });

  for (let i = 0; i < tx.txIns.length; i++) {
    const prevTxid = Buffer.from(tx.txIns[i].txHashBuf)
      .reverse()
      .toString("hex");
    parts.push({
      group: `input_${i}`,
      type: `input_${i}_txHashBuf`,
      val: `Here's the previous transaction: <a href="https://whatsonchain.com/tx/${prevTxid}">${prevTxid}</a>`,
      buf: tx.txIns[i].txHashBuf,
    });
    parts.push({
      group: `input_${i}`,
      type: `input_${i}_txOutNum`,
      val: `Uses the ${tx.txIns[i].txOutNum.toString()}-th output of the prev TX`,
      buf: new bsvjs.Bw().writeUInt32LE(tx.txIns[i].txOutNum).toBuffer(),
    });
    parts.push({
      group: `input_${i}`,
      type: `input_${i}_scriptVi`,
      val: tx.txIns[i].scriptVi.toBn().toString() + " bytes",
      buf: tx.txIns[i].scriptVi.buf,
    });
    parts.push({
      group: `input_${i}`,
      type: `input_${i}_script`,
      val: tx.txIns[i].script.toAsmString(),
      buf: tx.txIns[i].script.toBuffer(),
    });
    parts.push({
      group: `input_${i}`,
      type: `input_${i}_nSequence`,
      val: tx.txIns[i].nSequence.toString(),
      buf: new bsvjs.Bw().writeUInt32LE(tx.txIns[i].nSequence).toBuffer(),
    });
  }

  parts.push({
    type: "txOutsVi",
    val: tx.txOutsVi.toBn().toString() + " output(s)",
    buf: tx.txOutsVi.buf,
  });

  for (let i = 0; i < tx.txOuts.length; i++) {
    parts.push({
      group: `output_${i}`,
      type: `output_${i}_valueBn`,
      val: tx.txOuts[i].valueBn.toString() + " satoshis",
      buf: new bsvjs.Bw().writeUInt64LEBn(tx.txOuts[i].valueBn).toBuffer(),
    });
    parts.push({
      group: `output_${i}`,
      type: `output_${i}_scriptVi`,
      val: tx.txOuts[i].scriptVi.toBn().toString() + " bytes",
      buf: tx.txOuts[i].scriptVi.buf,
    });
    parts.push({
      group: `output_${i}`,
      type: `output_${i}_script`,
      val: tx.txOuts[i].script.toAsmString(),
      buf: tx.txOuts[i].script.toBuffer(),
    });
  }

  parts.push({
    type: "nLockTime",
    val: tx.nLockTime.toString(),
    buf: new bsvjs.Bw().writeUInt32LE(tx.nLockTime).toBuffer(),
  });

  return parts;
}
