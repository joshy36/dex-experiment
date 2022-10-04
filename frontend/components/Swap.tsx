import * as React from "react";

export default function Swap() {
  return (
    <form>
      <label htmlFor="tokenId">Token ID</label>
      <input id="tokenId" placeholder="420" />
      <button>Mint</button>
    </form>
  );
}
