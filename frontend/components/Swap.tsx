import * as React from "react";
import { usePrepareContractWrite } from "wagmi";

export default function Swap() {
  const [amount, setSwapAmount] = React.useState("");

  const { config } = usePrepareContractWrite({
    addressOrName: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
    contractInterface: [
      {
        name: "mint",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [{ internalType: "uint32", name: "tokenId", type: "uint32" }],
        outputs: [],
      },
    ],
    functionName: "mint",
    args: [parseInt(amount)],
    enabled: Boolean(amount),
  });

  return (
    <form>
      <label htmlFor="amount">Swap</label>
      <input
        id="Swap"
        onChange={(e) => setSwapAmount(e.target.value)}
        placeholder="0"
        value={amount}
      />
      <button>Swap</button>
    </form>
  );
}
