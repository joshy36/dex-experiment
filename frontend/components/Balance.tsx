import { useAccount, useBalance } from "wagmi";

export default function Balance() {
  const { address } = useAccount();

  const { data } = useBalance({
    addressOrName: address,
  });

  const balance = useBalance({
    addressOrName: address,
    token: "0x1B66F72E2aD41Fab10EFa591A224f1f52C44D855",
  });

  return (
    <div>
      <div style={{ float: "right" }}>
        Balance: {data?.formatted.substring(0, 5)} {data?.symbol}
      </div>
      <br></br>
      <div style={{ float: "right" }}>
        USDJ: {balance.data?.formatted.substring(0, 5)} {`USDJ`}
      </div>
    </div>
  );
}
