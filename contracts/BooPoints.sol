// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BooPoints is Ownable(msg.sender) {
    mapping(address => uint256) public points;

    event PointsAwarded(address indexed user, uint256 amount);
    event PointsRedeemed(address indexed user, uint256 amount);

    function awardPoints(address user, uint256 amount) external onlyOwner {
        points[user] += amount;
        emit PointsAwarded(user, amount);
    }

    function redeemPoints(uint256 amount) external {
        require(points[msg.sender] >= amount, "Not enough points");
        points[msg.sender] -= amount;
        emit PointsRedeemed(msg.sender, amount);
        // Logic to mint NFT or something
    }
}