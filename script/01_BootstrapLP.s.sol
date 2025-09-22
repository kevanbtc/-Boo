// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
}

interface IBooToken {
    function setDexPair(address pair, bool enabled) external;
    function enableTrading() external;
    function owner() external view returns (address);
}

interface ILaunchGuard {
    function setLive(uint256 blockNumber) external;
}

interface ILPVault {
    function deposit(uint256 tokenId) external;
}

interface INonfungiblePositionManager {
    struct MintParams {
        address token0;
        address token1;
        uint24 fee;
        int24 tickLower;
        int24 tickUpper;
        uint256 amount0Desired;
        uint256 amount1Desired;
        uint256 amount0Min;
        uint256 amount1Min;
        address recipient;
        uint256 deadline;
    }

    struct CollectParams {
        uint256 tokenId;
        address recipient;
        uint128 amount0Max;
        uint128 amount1Max;
    }

    function createAndInitializePoolIfNecessary(
        address token0,
        address token1,
        uint24 fee,
        uint160 sqrtPriceX96
    ) external payable returns (address pool);

    function mint(MintParams calldata params)
        external
        payable
        returns (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        );

    function approve(address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
}

/**
 * @title Bootstrap LP Script
 * @notice Creates initial liquidity pool for $BOO token and arms trading
 * @dev This script:
 *   1. Calculates optimal price and tick range
 *   2. Creates QuickSwap v3 pool (if needed)
 *   3. Mints LP position in tight range
 *   4. Transfers LP NFT to LPVault
 *   5. Arms trading: setDexPair → enableTrading → setLive
 */
contract BootstrapLP is Script {
    // Contract addresses (Polygon mainnet)
    address constant BOO_TOKEN = 0x550f4AF6E9466E4860c1E26509Df72EC30CF72AD;
    address constant USDC = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359; // Native USDC
    address constant LP_VAULT = 0x99Bd41Cd52963C06e640A4d8b180982812E296A3;
    address constant LAUNCH_GUARD = 0x4A72158B8859Fc4C9Dd0eB0C593FF07EC5327048;

    // QuickSwap v3 (Polygon)
    address constant QUICKSWAP_NFPM = 0xF6Ad3CcF71Abb3E12beCf6b3D2a74C963859ADCd;
    uint24 constant POOL_FEE = 3000; // 0.3%

    // Deployment parameters (configure before running)
    uint256 constant USDC_PER_BOO_PRICE = 0.001e6; // $0.001 USDC per BOO (6 decimals)
    uint256 constant BOO_SEED_AMOUNT = 1_000_000e18; // 1M BOO
    uint256 constant USDC_SEED_AMOUNT = 1_000e6; // $1,000 USDC

    // Tick range: ±2% around listing price
    int24 constant TICK_SPACING = 60; // for 0.3% fee pools
    int24 constant RANGE_TICKS = 334; // ~2% range

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("=== BOO LP Bootstrap ===");
        console.log("Deployer:", deployer);
        console.log("BOO Token:", BOO_TOKEN);
        console.log("USDC:", USDC);
        console.log("LP Vault:", LP_VAULT);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Calculate price and ticks
        (uint160 sqrtPriceX96, int24 tickLower, int24 tickUpper) = calculatePriceAndTicks();

        console.log("Calculated sqrtPriceX96:", sqrtPriceX96);
        console.log("Tick range:", tickLower, "to", tickUpper);

        // 2. Ensure we have tokens
        IERC20 booToken = IERC20(BOO_TOKEN);
        IERC20 usdcToken = IERC20(USDC);

        require(booToken.balanceOf(deployer) >= BOO_SEED_AMOUNT, "Insufficient BOO balance");
        require(usdcToken.balanceOf(deployer) >= USDC_SEED_AMOUNT, "Insufficient USDC balance");

        // 3. Create pool if needed
        INonfungiblePositionManager nfpm = INonfungiblePositionManager(QUICKSWAP_NFPM);
        address pool = nfpm.createAndInitializePoolIfNecessary(
            BOO_TOKEN < USDC ? BOO_TOKEN : USDC, // token0 (lower address)
            BOO_TOKEN < USDC ? USDC : BOO_TOKEN, // token1 (higher address)
            POOL_FEE,
            sqrtPriceX96
        );

        console.log("Pool created/found at:", pool);

        // 4. Approve tokens
        booToken.approve(QUICKSWAP_NFPM, BOO_SEED_AMOUNT);
        usdcToken.approve(QUICKSWAP_NFPM, USDC_SEED_AMOUNT);

        // 5. Mint LP position
        (uint256 amount0Desired, uint256 amount1Desired) = BOO_TOKEN < USDC
            ? (BOO_SEED_AMOUNT, USDC_SEED_AMOUNT)
            : (USDC_SEED_AMOUNT, BOO_SEED_AMOUNT);

        INonfungiblePositionManager.MintParams memory mintParams = INonfungiblePositionManager.MintParams({
            token0: BOO_TOKEN < USDC ? BOO_TOKEN : USDC,
            token1: BOO_TOKEN < USDC ? USDC : BOO_TOKEN,
            fee: POOL_FEE,
            tickLower: tickLower,
            tickUpper: tickUpper,
            amount0Desired: amount0Desired,
            amount1Desired: amount1Desired,
            amount0Min: (amount0Desired * 95) / 100, // 5% slippage
            amount1Min: (amount1Desired * 95) / 100,
            recipient: deployer,
            deadline: block.timestamp + 600
        });

        (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1) = nfpm.mint(mintParams);

        console.log("LP NFT minted:");
        console.log("  Token ID:", tokenId);
        console.log("  Liquidity:", liquidity);
        console.log("  Amount0 used:", amount0);
        console.log("  Amount1 used:", amount1);

        // 6. Transfer LP NFT to vault
        nfpm.approve(LP_VAULT, tokenId);
        ILPVault(LP_VAULT).deposit(tokenId);
        console.log("LP NFT deposited to vault");

        // 7. ARM TRADING (CRITICAL - SAME BLOCK IF POSSIBLE)
        IBooToken booContract = IBooToken(BOO_TOKEN);

        console.log("Arming trading...");
        booContract.setDexPair(pool, true);
        console.log("✓ DEX pair set");

        booContract.enableTrading();
        console.log("✓ Trading enabled");

        ILaunchGuard(LAUNCH_GUARD).setLive(block.number);
        console.log("✓ Launch guard armed at block:", block.number);

        vm.stopBroadcast();

        console.log("\n=== BOOTSTRAP COMPLETE ===");
        console.log("Pool address:", pool);
        console.log("LP NFT ID:", tokenId);
        console.log("QuickSwap URL:");
        console.log(string(abi.encodePacked(
            "https://quickswap.exchange/#/swap?currency0=",
            addressToString(USDC),
            "&currency1=",
            addressToString(BOO_TOKEN)
        )));
    }

    /**
     * @notice Calculate sqrtPriceX96 and tick range for the given price
     * @dev Price = USDC per BOO (in 6 decimals)
     * @return sqrtPriceX96 The sqrt price encoded as X96
     * @return tickLower Lower tick for LP range
     * @return tickUpper Upper tick for LP range
     */
    function calculatePriceAndTicks() internal pure returns (uint160 sqrtPriceX96, int24 tickLower, int24 tickUpper) {
        // Price calculation for QuickSwap v3
        // price = (sqrtPriceX96 / 2^96)^2 * (10^decimals1 / 10^decimals0)

        // For BOO/USDC pair:
        // - BOO has 18 decimals
        // - USDC has 6 decimals
        // - We want price = USDC_PER_BOO_PRICE (in USDC per BOO)

        uint256 price; // price in terms of token1/token0 ratio

        if (BOO_TOKEN < USDC) {
            // token0 = BOO, token1 = USDC
            // price = USDC per BOO = USDC_PER_BOO_PRICE * 10^(18-6) = USDC_PER_BOO_PRICE * 10^12
            price = USDC_PER_BOO_PRICE * 1e12;
        } else {
            // token0 = USDC, token1 = BOO
            // price = BOO per USDC = 1/USDC_PER_BOO_PRICE * 10^(18-6) = 10^18 / USDC_PER_BOO_PRICE
            price = 1e24 / USDC_PER_BOO_PRICE;
        }

        // Calculate sqrtPriceX96 = sqrt(price) * 2^96
        uint256 sqrtPrice = sqrt(price);
        sqrtPriceX96 = uint160((sqrtPrice * (2**96)) / 1e9); // Adjust for precision

        // Calculate tick from price: tick = log_1.0001(price)
        int24 tick = getTickAtSqrtRatio(sqrtPriceX96);

        // Round to tick spacing and create range
        tick = (tick / TICK_SPACING) * TICK_SPACING;
        tickLower = tick - RANGE_TICKS;
        tickUpper = tick + RANGE_TICKS;

        // Ensure ticks are aligned to spacing
        tickLower = (tickLower / TICK_SPACING) * TICK_SPACING;
        tickUpper = (tickUpper / TICK_SPACING) * TICK_SPACING;
    }

    /**
     * @notice Integer square root using Newton's method
     */
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    /**
     * @notice Approximate tick calculation from sqrt ratio
     * @dev Simplified version - for production use exact math library
     */
    function getTickAtSqrtRatio(uint160 sqrtPriceX96) internal pure returns (int24 tick) {
        // Simplified tick calculation
        // In production, use exact libraries like @uniswap/v3-sdk
        uint256 ratio = (uint256(sqrtPriceX96) * uint256(sqrtPriceX96)) >> 96;

        if (ratio >= 1e18) {
            tick = int24(int256((ratio - 1e18) / 1e14)); // Rough approximation
        } else {
            tick = -int24(int256((1e18 - ratio) / 1e14));
        }

        // Clamp to valid range
        if (tick < -887272) tick = -887272;
        if (tick > 887272) tick = 887272;
    }

    /**
     * @notice Convert address to string for URL construction
     */
    function addressToString(address addr) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes20 value = bytes20(addr);
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i] & 0x0f)];
        }
        return string(str);
    }
}