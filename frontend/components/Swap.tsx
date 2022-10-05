import * as React from "react";

export default function Swap() {
  return (
    <form>
      <label htmlFor="tokenId">Swap</label>
      <input id="tokenId" placeholder="0.0" />
      <button>Swap</button>
    </form>
  );
}
