// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FeeRouter is Ownable(msg.sender) {
    IERC20 public booToken;
    address public lpVault;
    address public prizePool;
    address public affiliatePool;
    uint256 public lpBps = 5000; // 50%
    uint256 public prizeBps = 2500; // 25%
    uint256 public affiliateBps = 2500; // 25%
    uint256 public totalBps = 10000;

    constructor(address _booToken, address _lpVault, address _prizePool, address _affiliatePool) {
        booToken = IERC20(_booToken);
        lpVault = _lpVault;
        prizePool = _prizePool;
        affiliatePool = _affiliatePool;
    }

    function takeFee(address from, address to, uint256 amount) external returns (uint256 feeTaken) {
        // Assume 0.5% fee for example, but configurable
        uint256 feeBps = 50; // 0.5%
        feeTaken = (amount * feeBps) / totalBps;
        if (feeTaken > 0) {
            // Transfer fee to pools
            uint256 lpFee = (feeTaken * lpBps) / totalBps;
            uint256 prizeFee = (feeTaken * prizeBps) / totalBps;
            uint256 affFee = feeTaken - lpFee - prizeFee; // affiliate
            booToken.transferFrom(from, lpVault, lpFee);
            booToken.transferFrom(from, prizePool, prizeFee);
            booToken.transferFrom(from, affiliatePool, affFee);
        }
    }

    // Admin functions to update splits, but time-locked in real impl
    function setFeeSplits(uint256 _lpBps, uint256 _prizeBps, uint256 _affBps) external onlyOwner {
        require(_lpBps + _prizeBps + _affBps == totalBps, "Invalid splits");
        lpBps = _lpBps;
        prizeBps = _prizeBps;
        affiliateBps = _affBps;
    }
}