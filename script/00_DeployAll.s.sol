// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
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
        BooCostumeNFT nft = new BooCostumeNFT("https://ipfs.io/ipfs/QmYourIPFSHash"); // update with real IPFS
        BooPoints points = new BooPoints(address(nft));
        BooToken token = new BooToken(maxSupply);
        LaunchGuard guard = new LaunchGuard(address(this), 5, 1000 * 1e18, 10000 * 1e18, block.timestamp + 10 minutes);
        LPVault lpVault = new LPVault(address(0)); // placeholder
        FeeRouter feeRouter = new FeeRouter(address(token), address(lpVault), address(points), address(referrals)); // prize to points, affiliate to referrals
        StakingManager staking = new StakingManager(address(token));
        AirdropMerkle airdrop = new AirdropMerkle(address(token), bytes32(0)); // placeholder root

        // Wire them
        token.setReferrals(address(referrals));
        token.setLaunchGuard(address(guard));
        // token.setFeeRouter(address(feeRouter)); // if enabling fees

        // Allocate tokens
        uint256 airdropAlloc = maxSupply * 10 / 100; // 10%
        uint256 lpAlloc = maxSupply * 10 / 100; // 10%
        uint256 opsAlloc = maxSupply * 5 / 100; // 5%
        // Transfer to multisigs (placeholders)
        token.transfer(address(airdrop), airdropAlloc);
        token.transfer(address(lpVault), lpAlloc);
        // Keep rest in deployer

        vm.stopBroadcast();

        // Log addresses
        console.log("BooToken:", address(token));
        console.log("ReferralRegistry:", address(referrals));
        console.log("BooCostumeNFT:", address(nft));
        console.log("BooPoints:", address(points));
        console.log("LaunchGuard:", address(guard));
        console.log("FeeRouter:", address(feeRouter));
        console.log("StakingManager:", address(staking));
        console.log("AirdropMerkle:", address(airdrop));
        console.log("LPVault:", address(lpVault));
    }
}