// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BooCostumeNFT is ERC1155, Ownable {
    string public name = "Boo Costume";
    string public symbol = "BOOC";
    uint256 public constant PUMPKIN = 1;
    uint256 public constant VAMPIRE = 2;
    uint256 public constant WITCH = 3;
    uint256 public constant GHOST = 4;

    mapping(uint256 => uint256) public boostBps; // e.g., 500 for 5%

    constructor(string memory uri_) ERC1155(uri_) Ownable(msg.sender) {
        boostBps[PUMPKIN] = 500;
        boostBps[VAMPIRE] = 1000;
        boostBps[WITCH] = 1500;
        boostBps[GHOST] = 2000;
    }

    function mint(address to, uint256 id, uint256 amount) external onlyOwner {
        _mint(to, id, amount, "");
    }
}