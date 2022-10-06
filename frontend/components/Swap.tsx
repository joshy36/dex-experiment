import * as React from "react";
import { useContractRead } from "wagmi";

export default function Swap() {
  const [swap, setSwapAmount] = React.useState("");
  const contractRead = useContractRead({
    addressOrName: "0x904Cdbc42a3ECDA75A8547D785914a4862Aa42b9",
    contractInterface: [
      {
        name: "getERC20SwapPrice",
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
    functionName: "getERC20SwapPrice",
    args: [10000000],
  });
  console.log(contractRead.data);
  return (
    <div>
      <form>
        <label htmlFor="Swap"></label>
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
        <label htmlFor="Swap"></label>
        <input id="Swap" placeholder="0.0" value={swap} disabled={true} />
      </form>
    </div>
  );
}
