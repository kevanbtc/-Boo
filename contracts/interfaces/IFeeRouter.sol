// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IFeeRouter {
    function takeFee(address from, address to, uint256 amount) external returns (uint256);
}