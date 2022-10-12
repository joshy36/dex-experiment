import type { NextPage } from "next";
import { useAccount, useDisconnect, useEnsName } from "wagmi";
import Faucet from "../components/Faucet";
import Swap from "../components/Swap";
import Connect from "../components/Connect";
import Balance from "../components/Balance";
import Address from "../components/Address";

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div>
      {isConnected ? (
        <button style={{ float: "right" }} onClick={() => disconnect()}>
          Disconnect
        </button>
      ) : (
        <Connect></Connect>
      )}

      {isConnected ? <Address></Address> : <></>}
      <br></br>
      <br></br>
      {isConnected ? <Balance></Balance> : <></>}

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
      <Faucet />

      <p>Link to contract on goerli</p>
      <a
        href={`https://goerli.etherscan.io/address/0x904Cdbc42a3ECDA75A8547D785914a4862Aa42b9#code`}
        target="_blank"
        rel="noopener noreferrer"
      >
        here
      </a>
    </div>
  );
};

export default Home;
