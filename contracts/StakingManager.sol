// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakingManager is Ownable {
    struct Stake {
        uint256 amount;
        uint256 lockDays;
        uint256 startTime;
        uint256 rewards;
    }

    IERC20 public booToken;
    mapping(address => Stake[]) public stakes;
    uint256 public baseApr7d = 700; // 7%
    uint256 public baseApr14d = 1200; // 12%
    uint256 public baseApr31d = 2500; // 25%

    event Staked(address indexed user, uint256 amount, uint256 lockDays);
    event Unstaked(address indexed user, uint256 index, uint256 amount, uint256 penalty);

    constructor(address _booToken) Ownable(msg.sender) {
        booToken = IERC20(_booToken);
    }

    function deposit(uint256 amount, uint256 lockDays) external {
        require(lockDays == 7 || lockDays == 14 || lockDays == 31, "Invalid lock period");
        booToken.transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender].push(Stake(amount, lockDays, block.timestamp, 0));
        emit Staked(msg.sender, amount, lockDays);
    }

    function unstake(uint256 index) external {
        Stake storage s = stakes[msg.sender][index];
        require(block.timestamp >= s.startTime + s.lockDays * 1 days, "Still locked");
        uint256 penalty = 0;
        if (block.timestamp < s.startTime + s.lockDays * 1 days) {
            penalty = s.amount / 20; // 5% penalty, burned
        }
        uint256 returnAmount = s.amount - penalty;
        booToken.transfer(msg.sender, returnAmount);
        if (penalty > 0) {
            booToken.transfer(address(0xdead), penalty); // Burn penalty
        }
        emit Unstaked(msg.sender, index, returnAmount, penalty);
        // Remove stake
        stakes[msg.sender][index] = stakes[msg.sender][stakes[msg.sender].length - 1];
        stakes[msg.sender].pop();
    }

    // Calculate rewards, but for simplicity, not implemented fully
}