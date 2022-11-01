import { useConnect } from "wagmi";
import { ButtonGroupStyled, ButtonStyled } from "./ButtonStyled";

export default function Connect() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const wantedConnectors = connectors.slice(0, 3);
  return (
    <div style={{ float: "right" }}>
      <div>
        <ButtonGroupStyled
          variant="contained"
          aria-label="contained primary button group"
        >
          {wantedConnectors.map((connector: any) => (
            <ButtonStyled
              variant="contained"
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              {connector.name}
              {!connector.ready && " (unsupported)"}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                " (connecting)"}
            </ButtonStyled>
          ))}
        </ButtonGroupStyled>
        {error && <div>{error.message}</div>}
      </div>
    </div>
  );
}
