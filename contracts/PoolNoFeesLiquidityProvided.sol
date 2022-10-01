// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

/// @title A very simple DEX
/// @author joshy36
/// @notice This contract is used to swap between ETH and an ERC20 token and vice versa
contract PoolNoFeesLiquidityProvided {
    event SwapCompleted();

    IERC20 public token;

    // Initialize the pool to support an ERC20 token
    constructor(IERC20 _token) {
        token = _token;
    }

    /*//////////////////////////////////////////////////////////////
                                 SWAP   
    //////////////////////////////////////////////////////////////*/

    function swapETHforERC20(uint256 amount) public {
        uint256 amountRecieved = _calculateETHSwap(amount);
        token.transfer(msg.sender, amountRecieved);
        emit SwapCompleted();
    }

    function swapER20forETH(uint256 amount) public {
        uint256 amountRecieved = _calculateERC20Swap(amount);
        payable(msg.sender).transfer(amountRecieved); // look into this more
        emit SwapCompleted();
    }

    /*//////////////////////////////////////////////////////////////
                            PRICE CALCULATION
    //////////////////////////////////////////////////////////////*/

    function _calculateETHSwap(uint256 amount) private view returns (uint256) {
        uint256 ERC20Balance = getERC20Balance();
        uint256 ethBalance = getETHBalance();
        console.log(ERC20Balance);
        console.log(ethBalance);
        console.log(amount);

        uint256 amountRecieved = ERC20Balance -
            ((ethBalance * ERC20Balance) / (ethBalance + amount));
        console.log(amountRecieved);
        return amountRecieved;
    }

    function _calculateERC20Swap(uint256 amount)
        private
        view
        returns (uint256)
    {
        uint256 newBalance;
        uint256 oldBalance = getETHBalance();
        newBalance = ((1 - (amount / oldBalance)) * oldBalance);
        return oldBalance - newBalance;
    }

    /*//////////////////////////////////////////////////////////////
                           GETTER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function getERC20Balance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function getETHBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}
