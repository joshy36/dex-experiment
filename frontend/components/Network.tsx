import { ButtonGroup } from "@mui/material";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { ButtonStyled, ButtonGroupStyled } from "./ButtonStyled";

export default function Network() {
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  chains[0].name = "Mainnet";
  const chainsWanted = [chains[0], chains[3]];

  return (
    <div style={{ float: "right" }}>
      <>
        {chain?.name === "Mainnet" ? (
          <div>Please switch to Goerli</div>
        ) : (
          <div>Connected to {chain?.name}</div>
        )}
        <ButtonGroupStyled
          variant="contained"
          aria-label="contained primary button group"
        >
          {chainsWanted.map((x) => (
            <ButtonStyled
              variant="contained"
              disabled={!switchNetwork || x.id === chain?.id}
              key={x.id}
              onClick={() => switchNetwork?.(x.id)}
            >
              {x.name}
              {isLoading && pendingChainId === x.id && " (switching)"}
            </ButtonStyled>
          ))}
        </ButtonGroupStyled>
        <div>{error && error.message}</div>
      </>
    </div>
  );
}
