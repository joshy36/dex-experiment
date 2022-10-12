import { BigNumber, ethers } from "ethers";
import * as React from "react";
import { useContractRead } from "wagmi";

export default function Swap() {
  const [swap, setSwapAmount] = React.useState("0");

  let price: number | BigNumber = 0;
  if (!swap) {
    price = 0;
  } else {
    price = ethers.utils.parseEther(swap);
  }

  const contractRead = useContractRead({
    addressOrName: "0x904Cdbc42a3ECDA75A8547D785914a4862Aa42b9",
    contractInterface: [
      {
        name: "getETHSwapPrice",
        type: "function",
        stateMutability: "view",
        inputs: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
      },
    ],
    functionName: "getETHSwapPrice",
    args: [price],
  });

  console.log("swap", String(price));
  console.log(Number(String(contractRead.data)) / 10e17);
  return (
    <div>
      <form>
        <label htmlFor="Swap">ETH:</label>
        <input
          id="Swap"
          placeholder="0.0"
          type="number"
          value={swap}
          onChange={(e) => setSwapAmount(e.target.value)}
        />
        {isNaN(parseInt(swap)) || parseInt(swap) === 0 ? (
          <button disabled={true}>Enter an amount</button>
        ) : (
          <button>Swap</button>
        )}
      </form>
      <form>
        <label htmlFor="Recieve">USDJ:</label>
        <input
          id="Recieve"
          placeholder="0.0"
          value={Number(String(contractRead.data)) / 10e17}
          disabled={true}
        />
      </form>
    </div>
  );
}
