// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract LaunchGuard is Ownable {
    uint256 public liveBlock; // set at enableTrading
    uint256 public deadBlocks; // e.g., 5
    uint256 public maxTx;      // temporary caps
    uint256 public maxWallet;  // temporary caps
    uint256 public liftTimestamp; // now + 10 minutes

    error TradingNotLive();
    error SniperBlock();
    error MaxTx();
    error MaxWallet();

    constructor(address owner_, uint256 _deadBlocks, uint256 _maxTx, uint256 _maxWallet, uint256 _liftTs) Ownable(owner_) {
        deadBlocks = _deadBlocks; maxTx = _maxTx; maxWallet = _maxWallet; liftTimestamp = _liftTs;
    }

    function setLive(uint256 blockNum) external onlyOwner { liveBlock = blockNum; }

    function onPreTransferCheck(address from, address to, uint256 amount) external view {
        if (liveBlock == 0) revert TradingNotLive();
        if (block.number < liveBlock + deadBlocks) revert SniperBlock();
        if (block.timestamp < liftTimestamp) {
            if (amount > maxTx) revert MaxTx();
            // `to` balance must be checked in token; here we only guard amount/blocks
        }
    }
}