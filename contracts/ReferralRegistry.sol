// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ReferralRegistry is Ownable(msg.sender) {
    struct RefStats { uint256 volume; uint256 commissionAccrued; }
    mapping(bytes32 => address) public codeOwner; // code → owner
    mapping(address => RefStats) public stats;
    uint96 public commissionBps = 200; // 2% of eligible volume (from rewards pool), hard‑capped by design

    event CodeRegistered(address indexed owner, bytes32 code);
    event ReferralRecorded(address indexed buyer, bytes32 indexed code, uint256 amount);

    function register(bytes32 code) external {
        require(codeOwner[code] == address(0), "taken");
        codeOwner[code] = msg.sender; emit CodeRegistered(msg.sender, code);
    }

    function recordReferral(address buyer, bytes32 code, uint256 amount) external {
        address ref = codeOwner[code];
        if (ref != address(0) && amount > 0) {
            stats[ref].volume += amount;
            uint256 comm = (amount * commissionBps) / 10_000;
            stats[ref].commissionAccrued += comm;
            emit ReferralRecorded(buyer, code, amount);
        }
    }

    // Admin can settle from rewards pool off‑chain or via a pull‑payment adaptor.
}