// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IReferralRegistry {
    function recordReferral(address buyer, bytes32 code, uint256 amount) external;
}