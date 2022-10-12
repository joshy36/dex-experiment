import { useAccount, useEnsName } from "wagmi";

export default function Address() {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  return (
    <div style={{ float: "right" }}>
      {ensName
        ? `${ensName} (${address})`
        : `${address?.substring(0, 5)}...${address?.substring(
            address.length - 4,
            address.length
          )}`}
    </div>
  );
}
