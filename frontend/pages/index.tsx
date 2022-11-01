import type { NextPage } from "next";
import { useAccount, useDisconnect, useEnsName } from "wagmi";
import Faucet from "../components/Faucet";
import Swap from "../components/Swap";
import Connect from "../components/Connect";
import Balance from "../components/Balance";
import Network from "../components/Network";
import { ButtonStyled } from "../components/ButtonStyled";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Link } from "@mui/material";

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });

  return (
    <body>
      {isConnected ? (
        <div>
          <Balance></Balance>
          <ButtonStyled
            variant="contained"
            style={{ float: "right" }}
            onClick={() => disconnect()}
          >
            {ensName
              ? `${ensName} (${address})`
              : `${address?.substring(0, 5)}...${address?.substring(
                  address.length - 4,
                  address.length
                )}`}
          </ButtonStyled>
          <Network></Network>
        </div>
      ) : (
        <Connect></Connect>
      )}

      <br></br>
      <br></br>

      <h1
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Swap
      </h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Swap />
      </div>
      <br></br>
      <br></br>
      <h2>Motivation</h2>
      <p>
        This project is a test to see if I can recreate a Uniswap V1 pool by
        only using the formalized documentation of a constant product market
        maker. The first iteration of the contract will have no fees and
        liquidity will already be provided in the pool. The second iteration
        will allow users to diposit liquidity and earn trading fees from the
        pool from LP tokens.
      </p>
      <a
        href={`https://github.com/runtimeverification/verified-smart-contracts/blob/uniswap/uniswap/x-y-k.pdf`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Link to paper
        <ArrowOutwardIcon fontSize="small" />
      </a>
      <Faucet />
      <br></br>
      <a
        href={`https://goerli.etherscan.io/address/0x904Cdbc42a3ECDA75A8547D785914a4862Aa42b9#code`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Link to pool contract on goerli
        <ArrowOutwardIcon fontSize="small" />
      </a>

      <br></br>
      <br></br>
      <footer>
        <Link
          href={`https://github.com/joshy36/dex-experiment`}
          target="_blank"
        >
          <GitHubIcon fontSize="large" />
        </Link>
        <Link href={`https://linkedin.com/in/joshy36`} target="_blank">
          <LinkedInIcon fontSize="large" />
        </Link>
        <Link href={`https://twitter.com/JoshuaBender16`} target="_blank">
          <TwitterIcon fontSize="large" />
        </Link>
      </footer>
    </body>
  );
};

export default Home;
