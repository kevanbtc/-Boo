// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract LPVault is Ownable {
    IERC721 public lpNft; // e.g., Uniswap V3 positions

    event LPJoined(address indexed user, uint256 tokenId);

    constructor(address _lpNft) Ownable(msg.sender) {
        lpNft = IERC721(_lpNft);
    }

    function depositLP(uint256 tokenId) external {
        lpNft.transferFrom(msg.sender, address(this), tokenId);
        emit LPJoined(msg.sender, tokenId);
    }
}