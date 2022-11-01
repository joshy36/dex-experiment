import * as React from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
} from "wagmi";
import { ButtonStyled } from "./ButtonStyled";

export default function Faucet() {
  const { config } = usePrepareContractWrite({
    addressOrName: "0x1B66F72E2aD41Fab10EFa591A224f1f52C44D855",
    contractInterface: [
      {
        name: "mint",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
      },
    ],
    functionName: "mint",
    args: [],
  });
  const { data, write } = useContractWrite(config);

  const { chain } = useNetwork();

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div>
      <h3>USDJ FAUCET</h3>
      <div>
        This faucet will send you 1000 USDJ if you want to swap to ETH or supply
        liquidity to the pool (supplying liquidity not yet supported)
      </div>
      <ButtonStyled
        variant="contained"
        onClick={() => write!()}
        disabled={!write || isLoading || chain?.name != "Goerli"}
      >
        {isLoading ? "Sending..." : "Send Me USDJ"}
      </ButtonStyled>
      {isSuccess && (
        <div>
          Successfully sent you 1,000 USDJ!
          <div>
            <a
              href={`https://goerli.etherscan.io/tx/${data?.hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Etherscan Link
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
