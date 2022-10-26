import type { NextPage } from "next";
import { useAccount, useDisconnect, useEnsName } from "wagmi";
import Faucet from "../components/Faucet";
import Swap from "../components/Swap";
import Connect from "../components/Connect";
import Balance from "../components/Balance";
import Network from "../components/Network";

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
          <button style={{ float: "right" }} onClick={() => disconnect()}>
            {ensName
              ? `${ensName} (${address})`
              : `${address?.substring(0, 5)}...${address?.substring(
                  address.length - 4,
                  address.length
                )}`}
          </button>
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
      </a>
      <Faucet />

      <p>Link to pool contract on goerli</p>
      <a
        href={`https://goerli.etherscan.io/address/0x904Cdbc42a3ECDA75A8547D785914a4862Aa42b9#code`}
        target="_blank"
        rel="noopener noreferrer"
      >
        here
      </a>
      <p>Link to github</p>
      <a
        href={`https://github.com/joshy36/dex-experiment`}
        target="_blank"
        rel="noopener noreferrer"
      >
        here
      </a>
    </body>
  );
};

export default Home;
