// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FeeRouter is Ownable {
    address public lpVault;
    address public prizePool;
    address public affiliatePool;
    uint256 public lpBps = 5000; // 50%
    uint256 public prizeBps = 2500; // 25%
    uint256 public affiliateBps = 2500; // 25%

    constructor(address _lpVault, address _prizePool, address _affiliatePool) Ownable(msg.sender) {
        lpVault = _lpVault;
        prizePool = _prizePool;
        affiliatePool = _affiliatePool;
    }

    function takeFee(address from, address to, uint256 amount) external returns (uint256 feeTaken) {
        // Assume fee is 0.5% or something, but since BooToken has 0%, this might not be called.
        // For now, return 0
        feeTaken = 0;
        // If enabled, calculate fee
        // But per spec, default 0%
    }

    // Admin functions to update splits, but time-locked in real impl
}