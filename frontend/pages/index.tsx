import type { NextPage } from "next";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useEnsName,
} from "wagmi";
import Faucet from "../components/Faucet";
import Swap from "../components/Swap";

const Home: NextPage = () => {
  const { address, connector, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  const { data } = useBalance({
    addressOrName: address,
  });

  const balance = useBalance({
    addressOrName: address,
    token: "0x1B66F72E2aD41Fab10EFa591A224f1f52C44D855",
  });

  if (isConnected) {
    return (
      <div>
        <button style={{ float: "right" }} onClick={() => disconnect()}>
          Disconnect
        </button>
        <div style={{ float: "right" }}>
          {ensName
            ? `${ensName} (${address})`
            : `${address?.substring(0, 5)}...${address?.substring(
                address.length - 4,
                address.length
              )}`}
        </div>
        <br></br>
        <br></br>
        <div style={{ float: "right" }}>
          Balance: {data?.formatted.substring(0, 5)} {data?.symbol}
        </div>
        <br></br>
        <div style={{ float: "right" }}>
          USDJ: {balance.data?.formatted.substring(0, 5)} {`USDJ`}
        </div>

        {/* <div style={{ textAlign: "right" }}>Connected to {connector?.name}</div> */}
        <h1>Swap!</h1>
        <Faucet />
        <Swap />
      </div>
    );
  }
  return (
    <div>
      <h1>Welcome</h1>
      <h2>Connect your wallet to swap</h2>
      <div>
        {connectors.map((connector: any) => (
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {!connector.ready && " (unsupported)"}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              " (connecting)"}
          </button>
        ))}

        {error && <div>{error.message}</div>}
      </div>
    </div>
  );
};

export default Home;
