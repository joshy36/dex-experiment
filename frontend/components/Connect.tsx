import { useConnect } from "wagmi";

export default function Connect() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  return (
    <div style={{ float: "right" }}>
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
}
