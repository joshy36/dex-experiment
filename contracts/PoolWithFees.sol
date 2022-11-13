// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

/// @title A very simple DEX
/// @author joshy36
/// @notice This contract is used to swap between ETH and an ERC20 token and vice versa
contract PoolWithFees {
    event SwapETHCompleted(
        address swapAddress,
        uint256 amountDeposited,
        uint256 amountRecieved
    );
    event SwapERC20Completed(
        address swapAddress,
        uint256 amountDeposited,
        uint256 amountRecieved
    );

    IERC20 public token;
    uint256 public fee;

    uint256 public ethFees = 0;
    uint256 public erc20Fees = 0;

    // Initialize the pool to support an ERC20 token
    /// @dev fee should be the 10x the integer value of the percent. ie input 3 for 0.3% fee
    constructor(IERC20 token_, uint256 fee_) {
        token = token_;
        fee = fee_;
    }

    /*//////////////////////////////////////////////////////////////
                                 SWAP   
    //////////////////////////////////////////////////////////////*/

    function swapETHForERC20() public payable {
        uint256 amountRecieved = _calculateETHSwap(msg.value);
        token.transfer(msg.sender, amountRecieved);
        ethFees += calculateFee(msg.value);
        emit SwapETHCompleted(msg.sender, msg.value, amountRecieved);
    }

    function swapERC20ForETH(uint256 amount) public payable {
        uint256 amountRecieved = _calculateERC20Swap(amount);
        token.transferFrom(msg.sender, address(this), amount);
        (bool success, ) = msg.sender.call{value: amountRecieved}("");
        require(success, "Transfer failed.");
        erc20Fees += calculateFee(amount);
        emit SwapERC20Completed(msg.sender, amount, amountRecieved);
    }

    /*//////////////////////////////////////////////////////////////
                            PRICE CALCULATION
    //////////////////////////////////////////////////////////////*/

    function _calculateETHSwap(uint256 amount) private view returns (uint256) {
        uint256 ERC20Balance = getERC20Balance();
        uint256 ethBalance = getETHBalance();
        uint256 amountRecieved = ERC20Balance -
            (((ethBalance - amount) * ERC20Balance) /
                ((ethBalance - amount) + amount));
        uint256 feeSize = calculateFee(amountRecieved);
        uint256 amountRecievedWithFee = amountRecieved - feeSize;
        return amountRecievedWithFee;
    }

    function _calculateERC20Swap(uint256 amount)
        private
        view
        returns (uint256)
    {
        uint256 ERC20Balance = getERC20Balance();
        uint256 ethBalance = getETHBalance();
        uint256 amountRecieved = ethBalance -
            ((ERC20Balance * ethBalance) / (ERC20Balance + amount));
        uint256 feeSize = calculateFee(amountRecieved);
        uint256 amountRecievedWithFee = amountRecieved - feeSize;
        return amountRecievedWithFee;
    }

    function calculateFee(uint256 amount) public view returns (uint256) {
        uint256 swapWithFee = (amount * fee) / 1000;
        return swapWithFee;
    }

    /*//////////////////////////////////////////////////////////////
                           GETTER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function getETHSwapPrice(uint256 amount) public view returns (uint256) {
        uint256 ERC20Balance = getERC20Balance();
        uint256 ethBalance = getETHBalance();
        uint256 amountRecieved = ERC20Balance -
            ((ethBalance * ERC20Balance) / (ethBalance + amount));
        uint256 feeSize = calculateFee(amountRecieved);
        uint256 amountRecievedWithFee = amountRecieved - feeSize;
        return amountRecievedWithFee;
    }

    function getERC20SwapPrice(uint256 amount) public view returns (uint256) {
        return _calculateERC20Swap(amount);
    }

    function getERC20Balance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function getETHBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}
