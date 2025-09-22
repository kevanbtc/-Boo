// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IBooCostumeNFT {
    function mint(address to, uint256 id, uint256 amount) external;
}

contract BooPoints is Ownable(msg.sender) {
    IBooCostumeNFT public costumeNft;
    mapping(address => uint256) public points;

    event PointsAwarded(address indexed user, uint256 amount);
    event PointsRedeemed(address indexed user, uint256 amount, uint256 nftId);

    constructor(address _costumeNft) {
        costumeNft = IBooCostumeNFT(_costumeNft);
    }

    function awardPoints(address user, uint256 amount) external onlyOwner {
        points[user] += amount;
        emit PointsAwarded(user, amount);
    }

    function redeemForNft(uint256 id) external {
        require(points[msg.sender] >= 100, "Need 100 points for NFT");
        points[msg.sender] -= 100;
        costumeNft.mint(msg.sender, id, 1);
        emit PointsRedeemed(msg.sender, 100, id);
    }
}