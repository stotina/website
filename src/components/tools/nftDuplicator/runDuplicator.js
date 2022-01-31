import { loadRunSdk } from "../../../assets/js/run.sdk";

export async function readRelayNFT(location) {
  const Run = await loadRunSdk();

  const runReaderInstance = new Run({
    network: "main",
    app: "stotina-duplicator",
    owner: "L1oypiDZJdk7XVd15DiA8pd1nhzqdMDosGX3R8W7fGzszsUjDHL8", // 1J8EEhrSvJ8E42Ho3BKEPWd4bRNdPpdUNv
    purse: "L1oypiDZJdk7XVd15DiA8pd1nhzqdMDosGX3R8W7fGzszsUjDHL8",
  });
  runReaderInstance.trust("*");

  const jig = await runReaderInstance.load(location);
  return jig;
}

export async function issueDuplicateNFTs(
  privKey,
  metadata,
  count,
  destinationAddr
) {
  const Run = await loadRunSdk();
  
  const run = new Run({
    network: "main",
    app: "stotina-duplicator",
    owner: privKey,
    purse: privKey,
  });
  run.trust("*");

  const RelayNFT = await run.load(
    "cdea2c203af755cd9477ca310c61021abaafc135a21d8f93b8ebfc6ca5f95712_o1"
  );
  const OrderLock = await run.load(
    "d6170025a62248d8df6dc14e3806e68b8df3d804c800c7bfb23b0b4232862505_o1"
  );

  const DuplicatorNFT = eval("(function(){ class DuplicatorNFT extends RelayNFT {}; return DuplicatorNFT; })()")
  DuplicatorNFT.interactive = false;
  DuplicatorNFT.friends = [OrderLock];
  DuplicatorNFT.metadata = metadata;

  console.log(`Created ${DuplicatorNFT.name} extending ${RelayNFT.name}`);

  const contract = await run.deploy(DuplicatorNFT);
    await contract.sync();

  console.log(
    "deployed smart contract : " + contract.location + "\n" + DuplicatorNFT
  );

  const mintedTokens = await mintNftBulkToOne(
    DuplicatorNFT,
    metadata,
    count,
    destinationAddr
  );
  return mintedTokens;
}

export async function mintNftBulkToOne(Contract, metadata, count, address) {
  let counter = 0;
  const jigs = await bulkOperation(
    () => counter < count,
    () => {
      counter++;
      return Contract.mint(address, metadata);
    }
  );
  return jigs.map((i) => i.location);
}

export async function mintNftBulkToMany(Contract, metadata, ...addressList) {
  let counter = 0;
  const jigs = await bulkOperation(
    () => counter <= addressList.length,
    () => {
      return Contract.mint(addressList[counter++], metadata);
    }
  );
  return jigs.map((i) => i.location);
}

export async function bulkOperation(loopCondition, callbackOnEachItteration) {
  const Run = await loadRunSdk();
  
  const tx = new Run.Transaction();
  let counter = 0;
  const callbackResults = [];
  while (loopCondition(counter++)) {
    tx.update(() => {
      callbackResults.push(callbackOnEachItteration());
    });
  }
  await tx.publish();
  return callbackResults;
}
