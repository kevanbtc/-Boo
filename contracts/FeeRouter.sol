// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FeeRouter is Ownable(msg.sender) {
    IERC20 public booToken;
    address public lpVault;
    address public prizePool;
    address public affiliatePool;
    uint256 public lpBps = 4000; // 40%
    uint256 public prizeBps = 2000; // 20%
    uint256 public affiliateBps = 2000; // 20%
    uint256 public burnBps = 2000; // 20% burn for deflation
    uint256 public totalBps = 10000;
    uint256 public feeBps = 50; // 0.5%
    uint256 public totalBurned;

    constructor(address _booToken, address _lpVault, address _prizePool, address _affiliatePool) {
        booToken = IERC20(_booToken);
        lpVault = _lpVault;
        prizePool = _prizePool;
        affiliatePool = _affiliatePool;
    }

    function takeFee(address from, address to, uint256 amount) external returns (uint256 feeTaken) {
        feeTaken = (amount * feeBps) / totalBps;
        if (feeTaken > 0) {
            uint256 lpFee = (feeTaken * lpBps) / totalBps;
            uint256 prizeFee = (feeTaken * prizeBps) / totalBps;
            uint256 affFee = (feeTaken * affiliateBps) / totalBps;
            uint256 burnFee = (feeTaken * burnBps) / totalBps;
            booToken.transferFrom(from, lpVault, lpFee);
            booToken.transferFrom(from, prizePool, prizeFee);
            booToken.transferFrom(from, affiliatePool, affFee);
            booToken.transferFrom(from, address(0xdead), burnFee);
            totalBurned += burnFee;
            emit TradeFeeSplit(from, amount, feeTaken, lpFee, prizeFee, affFee, burnFee);
        }
    }

    function getFeeConfig() external view returns (uint256, uint256, uint256, uint256, uint256) {
        return (feeBps, lpBps, prizeBps, affiliateBps, burnBps);
    }

    function setFeeSplits(uint256 _lpBps, uint256 _prizeBps, uint256 _affBps, uint256 _burnBps) external onlyOwner {
        require(_lpBps + _prizeBps + _affBps + _burnBps == totalBps, "Invalid splits");
        require(_lpBps <= 7000 && _prizeBps <= 7000 && _affBps <= 7000 && _burnBps <= 7000, "Max 70% per split");
        lpBps = _lpBps;
        prizeBps = _prizeBps;
        affiliateBps = _affBps;
        burnBps = _burnBps;
    }

    event TradeFeeSplit(address indexed buyer, uint256 volume, uint256 fee, uint256 lpAmt, uint256 prizeAmt, uint256 affAmt, uint256 burnAmt);
}