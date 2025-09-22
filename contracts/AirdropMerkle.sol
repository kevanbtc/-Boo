// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract AirdropMerkle is Ownable {
    IERC20 public token;
    bytes32 public merkleRoot;
    mapping(address => bool) public claimed;

    event Claimed(address indexed claimant, uint256 amount);

    constructor(address _token, bytes32 _merkleRoot) Ownable(msg.sender) {
        token = IERC20(_token);
        merkleRoot = _merkleRoot;
    }

    function claim(address claimant, uint256 amount, bytes32[] calldata proof) external {
        require(!claimed[claimant], "Already claimed");
        bytes32 leaf = keccak256(abi.encodePacked(claimant, amount));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");
        claimed[claimant] = true;
        token.transfer(claimant, amount);
        emit Claimed(claimant, amount);
    }
}