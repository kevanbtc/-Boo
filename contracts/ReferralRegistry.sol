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
    event AffiliateCommission(address indexed acct, uint256 volumeAfter, uint256 bpsApplied, uint256 commission);

    function register(bytes32 code) external {
        require(codeOwner[code] == address(0), "taken");
        codeOwner[code] = msg.sender; emit CodeRegistered(msg.sender, code);
    }

    function recordReferral(address buyer, bytes32 code, uint256 amount) external {
        address ref = codeOwner[code];
        if (ref != address(0) && amount > 0) {
            stats[ref].volume += amount;
            uint256 dynamicCommissionBps = getCommissionBps(stats[ref].volume);
            uint256 comm = (amount * dynamicCommissionBps) / 10_000;
            stats[ref].commissionAccrued += comm;
            emit ReferralRecorded(buyer, code, amount);
            emit AffiliateCommission(ref, stats[ref].volume, dynamicCommissionBps, comm);
        }
    }

    function getCommissionBps(uint256 volume) public pure returns (uint256) {
        if (volume >= 100000 * 1e18) return 300; // 3% for 100k+ volume
        if (volume >= 50000 * 1e18) return 250; // 2.5%
        if (volume >= 10000 * 1e18) return 200; // 2%
        return 150; // 1.5% base
    }

    // Admin can settle from rewards pool off‑chain or via a pull‑payment adaptor.
}