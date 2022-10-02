// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title A very simple DEX
/// @author joshy36
/// @notice This contract is used to swap between ETH and an ERC20 token and vice versa
contract PoolNoFeesLiquidityProvided {
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

    // Initialize the pool to support an ERC20 token
    constructor(IERC20 _token) {
        token = _token;
    }

    /*//////////////////////////////////////////////////////////////
                                 SWAP   
    //////////////////////////////////////////////////////////////*/

    function swapETHForERC20() public payable {
        uint256 amountRecieved = _calculateETHSwap(msg.value);
        token.transfer(msg.sender, amountRecieved);
        emit SwapETHCompleted(msg.sender, msg.value, amountRecieved);
    }

    function swapERC20ForETH(uint256 amount) public payable {
        uint256 amountRecieved = _calculateERC20Swap(amount);
        token.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(amountRecieved); // look into this more
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
        return amountRecieved;
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
        return amountRecieved;
    }

    /*//////////////////////////////////////////////////////////////
                           GETTER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @dev Since the ETH is desposited into the contract pre swap we need different logic for the get and the actual swap
    function getETHSwapPrice(uint256 amount) public view returns (uint256) {
        uint256 ERC20Balance = getERC20Balance();
        uint256 ethBalance = getETHBalance();
        uint256 amountRecieved = ERC20Balance -
            ((ethBalance * ERC20Balance) / (ethBalance + amount));
        return amountRecieved;
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
