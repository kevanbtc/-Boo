// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {BooToken} from "../contracts/BooToken.sol";
import {LaunchGuard} from "../contracts/LaunchGuard.sol";
import {ReferralRegistry} from "../contracts/ReferralRegistry.sol";
import {FeeRouter} from "../contracts/FeeRouter.sol";
import {StakingManager} from "../contracts/StakingManager.sol";
import {BooCostumeNFT} from "../contracts/BooCostumeNFT.sol";
import {BooPoints} from "../contracts/BooPoints.sol";
import {AirdropMerkle} from "../contracts/AirdropMerkle.sol";
import {LPVault} from "../contracts/LPVault.sol";

contract DeployAll is Script {
    function run() external {
        vm.startBroadcast();

        uint256 maxSupply = 1_000_000_000 * 1e18;

        // Deploy contracts
        ReferralRegistry referrals = new ReferralRegistry();
        BooCostumeNFT nft = new BooCostumeNFT("https://ipfs.io/ipfs/..."); // placeholder
        BooToken token = new BooToken(maxSupply);
        LaunchGuard guard = new LaunchGuard(address(this), 5, 1000 * 1e18, 10000 * 1e18, block.timestamp + 10 minutes);
        FeeRouter feeRouter = new FeeRouter(address(0), address(0), address(0)); // placeholders
        StakingManager staking = new StakingManager(address(token));
        BooPoints points = new BooPoints();
        AirdropMerkle airdrop = new AirdropMerkle(address(token), bytes32(0)); // placeholder root
        LPVault lpVault = new LPVault(address(0)); // placeholder

        // Wire them
        token.setReferrals(address(referrals));
        token.setLaunchGuard(address(guard));
        // etc.

        vm.stopBroadcast();
    }
}