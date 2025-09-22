// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface IBooToken {
    function setDexPair(address pair, bool enabled) external;
    function enableTrading() external;
}

interface ILaunchGuard {
    function setLive(uint256 blockNumber) external;
}

interface IQuickSwapFactory {
    function createPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external returns (address pool);
}

interface IQuickSwapPool {
    function initialize(uint160 sqrtPriceX96) external;
}

/**
 * @title Simple Launch Script
 * @notice Streamlined launch for Friends & Family at $0.001 per BOO
 */
contract SimpleLaunch is Script {
    // Addresses
    address constant BOO_TOKEN = 0x550f4AF6E9466E4860c1E26509Df72EC30CF72AD;
    address constant USDC = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359;
    address constant LAUNCH_GUARD = 0x4A72158B8859Fc4C9Dd0eB0C593FF07EC5327048;

    // QuickSwap v3 Factory
    address constant FACTORY = 0x411b0fAcC3489691f28ad58c47006AF5E3Ab3A28;
    uint24 constant FEE = 3000; // 0.3%

    // Pre-calculated for $0.001 price
    uint160 constant SQRT_PRICE_X96 = 2505414483750479251915075; // Exact for $0.001

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("METAMASK_PRIVKEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("=== SIMPLE BOO LAUNCH ===");
        console.log("Deployer:", deployer);
        console.log("Target Price: $0.001 per BOO");

        vm.startBroadcast(deployerPrivateKey);

        // Check balances
        IERC20 booToken = IERC20(BOO_TOKEN);
        IERC20 usdcToken = IERC20(USDC);

        uint256 booBalance = booToken.balanceOf(deployer);
        uint256 usdcBalance = usdcToken.balanceOf(deployer);

        console.log("BOO Balance:", booBalance / 1e18);
        console.log("USDC Balance:", usdcBalance / 1e6);

        require(booBalance >= 1000000e18, "Need 1M+ BOO");
        require(usdcBalance >= 1000e6, "Need $1000+ USDC");

        // Create pool
        IQuickSwapFactory factory = IQuickSwapFactory(FACTORY);
        address pool = factory.createPool(BOO_TOKEN, USDC, FEE);
        console.log("Pool created:", pool);

        // Initialize pool price
        IQuickSwapPool(pool).initialize(SQRT_PRICE_X96);
        console.log("Pool initialized at $0.001");

        // ARM TRADING - CRITICAL SEQUENCE
        IBooToken(BOO_TOKEN).setDexPair(pool, true);
        console.log("✓ DEX pair enabled");

        IBooToken(BOO_TOKEN).enableTrading();
        console.log("✓ Trading enabled");

        ILaunchGuard(LAUNCH_GUARD).setLive(block.number);
        console.log("✓ Launch guard armed");

        vm.stopBroadcast();

        console.log("\n=== LAUNCH COMPLETE ===");
        console.log("Pool Address:", pool);
        console.log("QuickSwap URL:");
        console.log("https://quickswap.exchange/#/swap?currency0=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359&currency1=0x550f4AF6E9466E4860c1E26509Df72EC30CF72AD");
        console.log("\nTRADING IS LIVE! 🚀");
    }
}