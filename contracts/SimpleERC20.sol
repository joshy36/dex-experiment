// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleERC20 is ERC20 {
    constructor() ERC20("TOKEN", "TKN") {
        _mint(msg.sender, 2000 * 10**18);
    }
}
