import { ConnectWallet, useContract, useContractEvents } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import "./styles/Home.css";
import usdcAbi from "./UsdcAbi.json";

export default function Home() {

  const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const sdk = new ThirdwebSDK("mainnet");
  const usdcContract = sdk.getContractFromAbi(usdcAddress, usdcAbi);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  let blockNumber = 0;
  let transactionIndex = 0;

  usdcContract.events.listenToAllEvents(
    (event) => {
      if (event.transaction.blockNumber > blockNumber && event.transaction.transactionIndex > transactionIndex) {
        blockNumber = event.transaction.blockNumber;
        transactionIndex = event.transaction.transactionIndex;
        if (event.eventName === "Transfer" && BigNumber.from(event.data.value._hex).gt(BigNumber.from(1000000000))) {
          console.log(event);
          setFrom(event.data.from);
          setTo(event.data.to);
          setValue(ethers.utils.formatUnits(BigNumber.from(event.data.value._hex), 6));
        }
      }
    }
  );

  return (
    <div className="container">
      <main className="main">
        <h1 className="title">
          Welcome to the Ethereum Blockchain Watcher
        </h1>

        <p className="description">
          Watch the USDC transfers on the Ethereum Blockchain!
        </p>

        <div>
            <p className="code">
              From: {from}
            </p>
            <p className="code">
              To: {to}
            </p>
            <p className="code">
              Value: {value}
            </p>
        </div>
      </main>
    </div>
  );
}
