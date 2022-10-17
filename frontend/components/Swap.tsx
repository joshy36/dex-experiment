import { FetchBalanceResult } from "@wagmi/core";
import { BigNumber, ethers } from "ethers";
import * as React from "react";
import {
  useAccount,
  useBalance,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import useDebounce from "../utils/debounce";

const useGetBalance = (address: string): FetchBalanceResult | undefined => {
  const { data } = useBalance({
    addressOrName: address,
  });
  return data;
};

export default function Swap() {
  const { address, isConnected } = useAccount();
  const [swap, setSwapAmount] = React.useState("0");
  const debouncedSwap = useDebounce(swap, 500);

  let price: number | BigNumber = 0;
  if (!swap) {
    price = 0;
  } else {
    price = ethers.utils.parseEther(swap);
  }
  const balanceEth = useGetBalance(String(address));

  // const { data } = useBalance({
  //   addressOrName: address,
  // });

  const balance = useBalance({
    addressOrName: address,
    token: "0x1B66F72E2aD41Fab10EFa591A224f1f52C44D855",
  });
  const ethBalance = Number(balanceEth?.formatted);
  const ethAmount = Number(Number(price) / 10e17);
  const hasEnoughEth = ethBalance > ethAmount;

  const { config } = usePrepareContractWrite({
    addressOrName: "0x904Cdbc42a3ECDA75A8547D785914a4862Aa42b9",
    contractInterface: [
      {
        inputs: [],
        name: "swapETHForERC20",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    functionName: "swapETHForERC20",
    enabled: Boolean(debouncedSwap),
    overrides: {
      from: address,
      value: ethers.utils.parseEther(swap),
    },
  });
  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

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
      </form>
      <form>
        <label htmlFor="Recieve">USDJ:</label>
        <input
          id="Recieve"
          placeholder="0.0"
          value={(Number(String(contractRead.data)) / 10e17) | 0}
          disabled={true}
        />
      </form>
      {!isConnected ? (
        <button disabled={true}>Connect Wallet</button>
      ) : isNaN(parseFloat(swap)) || parseFloat(swap) === 0 ? (
        <button disabled={true}>Enter an amount</button>
      ) : hasEnoughEth ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            write?.();
          }}
          disabled={!write || isLoading}
        >
          {isLoading ? "Swapping..." : "Swap"}
        </button>
      ) : (
        <button disabled={true}>Insufficient ETH Balance</button>
      )}
      {isSuccess && (
        <div>
          Swap submitted successfully!
          <div>
            <a
              href={`https://goerli.etherscan.io/tx/${data?.hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Etherscan
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
