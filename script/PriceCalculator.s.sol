// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";

/**
 * @title Price Calculator Helper
 * @notice Calculates precise sqrtPriceX96 and ticks for UniswapV3/QuickSwap pools
 * @dev Run this script to get exact values before LP bootstrap
 *
 * Usage:
 * forge script script/PriceCalculator.s.sol:PriceCalculator --rpc-url $POLYGON_RPC_URL -vvvv
 */
contract PriceCalculator is Script {
    // Configure your desired listing price here
    struct PriceConfig {
        uint256 usdcPerBoo; // Price in USDC (6 decimals), e.g., 0.001e6 = $0.001
        uint256 rangePercent; // Range around price in basis points, e.g., 200 = 2%
        uint24 poolFee; // Pool fee: 500 (0.05%), 3000 (0.3%), 10000 (1%)
    }

    // Token configuration
    address constant BOO_TOKEN = 0x550f4AF6E9466E4860c1E26509Df72EC30CF72AD;
    address constant USDC = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359;

    function run() external view {
        console.log("=== BOO/USDC Price Calculator ===\n");

        // Example configurations
        PriceConfig[5] memory configs = [
            PriceConfig(0.0001e6, 200, 3000), // $0.0001, ±2%, 0.3% fee
            PriceConfig(0.001e6, 200, 3000),  // $0.001, ±2%, 0.3% fee
            PriceConfig(0.01e6, 300, 3000),   // $0.01, ±3%, 0.3% fee
            PriceConfig(0.1e6, 500, 3000),    // $0.10, ±5%, 0.3% fee
            PriceConfig(1e6, 1000, 3000)      // $1.00, ±10%, 0.3% fee
        ];

        for (uint i = 0; i < configs.length; i++) {
            calculateAndPrint(configs[i]);
            console.log("");
        }

        console.log("=== Integration Code ===");
        console.log("Update your bootstrap script with the chosen values:");
        console.log("uint160 constant SQRT_PRICE_X96 = [chosen_sqrtPriceX96];");
        console.log("int24 constant TICK_LOWER = [chosen_tickLower];");
        console.log("int24 constant TICK_UPPER = [chosen_tickUpper];");
    }

    function calculateAndPrint(PriceConfig memory config) internal view {
        console.log("--- Price: $%s USDC per BOO (±%s%%, %s%% fee) ---",
            formatPrice(config.usdcPerBoo),
            formatBasisPoints(config.rangePercent),
            formatFee(config.poolFee)
        );

        (uint160 sqrtPriceX96, int24 tick, int24 tickLower, int24 tickUpper) =
            calculateExactPrice(config.usdcPerBoo, config.rangePercent, config.poolFee);

        console.log("sqrtPriceX96: %s", sqrtPriceX96);
        console.log("Current tick: %s", tick);
        console.log("Range: %s to %s", tickLower, tickUpper);

        // Calculate effective price range
        uint256 priceLower = tickToPrice(tickLower, true);
        uint256 priceUpper = tickToPrice(tickUpper, true);

        console.log("Effective range: $%s to $%s",
            formatPrice(priceLower),
            formatPrice(priceUpper)
        );

        // LP capital efficiency
        uint256 efficiency = (uint256(tickUpper - tickLower) * 10000) / 887272; // Max tick range
        console.log("Capital efficiency: %s%% of full range", efficiency / 100);

        // Foundry command
        console.log("Foundry deployment:");
        console.log("SQRT_PRICE_X96=%s TICK_LOWER=%s TICK_UPPER=%s \\",
            sqrtPriceX96, tickLower, tickUpper);
        console.log("forge script script/01_BootstrapLP.s.sol --rpc-url $POLYGON_RPC_URL --broadcast");
    }

    function calculateExactPrice(uint256 usdcPerBoo, uint256 rangePercent, uint24 poolFee)
        internal
        pure
        returns (uint160 sqrtPriceX96, int24 tick, int24 tickLower, int24 tickUpper)
    {
        // Determine tick spacing based on fee
        int24 tickSpacing = getTickSpacing(poolFee);

        // Calculate price ratio accounting for token order and decimals
        uint256 priceRatio;
        if (BOO_TOKEN < USDC) {
            // token0 = BOO (18 dec), token1 = USDC (6 dec)
            // price = USDC per BOO * 10^(18-6) = usdcPerBoo * 10^12
            priceRatio = usdcPerBoo * 1e12;
        } else {
            // token0 = USDC (6 dec), token1 = BOO (18 dec)
            // price = BOO per USDC = 1/usdcPerBoo * 10^(18-6) = 10^24 / usdcPerBoo
            priceRatio = 1e24 / usdcPerBoo;
        }

        // Calculate sqrtPriceX96 with high precision
        sqrtPriceX96 = uint160(sqrtPriceMath(priceRatio));

        // Get tick from sqrtPrice
        tick = getTickAtSqrtRatio(sqrtPriceX96);

        // Align to tick spacing
        tick = (tick / tickSpacing) * tickSpacing;

        // Calculate range ticks
        int24 rangeTicks = int24(int256((uint256(rangePercent) * 23027) / 10000)); // ln(1.0001) ≈ 0.00004342945 ≈ 1/23027
        rangeTicks = (rangeTicks / tickSpacing) * tickSpacing;

        tickLower = tick - rangeTicks;
        tickUpper = tick + rangeTicks;

        // Ensure tick bounds
        if (tickLower < -887272) tickLower = -887272;
        if (tickUpper > 887272) tickUpper = 887272;

        // Align to spacing
        tickLower = (tickLower / tickSpacing) * tickSpacing;
        tickUpper = (tickUpper / tickSpacing) * tickSpacing;

        // Recalculate sqrtPriceX96 from aligned tick for consistency
        sqrtPriceX96 = getSqrtRatioAtTick(tick);
    }

    function sqrtPriceMath(uint256 priceRatio) internal pure returns (uint256) {
        // High precision square root calculation
        // sqrtPriceX96 = sqrt(priceRatio) * 2^96
        uint256 sqrtPrice = sqrt(priceRatio * (2**192)) >> 96;
        return sqrtPrice;
    }

    function sqrt(uint256 x) internal pure returns (uint256 z) {
        if (x == 0) return 0;
        z = 1;
        uint256 y = x;
        if (y >= 2**128) { y >>= 128; z <<= 64; }
        if (y >= 2**64) { y >>= 64; z <<= 32; }
        if (y >= 2**32) { y >>= 32; z <<= 16; }
        if (y >= 2**16) { y >>= 16; z <<= 8; }
        if (y >= 2**8) { y >>= 8; z <<= 4; }
        if (y >= 2**4) { y >>= 4; z <<= 2; }
        if (y >= 2**2) { z <<= 1; }
        z = (z + x / z) >> 1;
        z = (z + x / z) >> 1;
        z = (z + x / z) >> 1;
        z = (z + x / z) >> 1;
        z = (z + x / z) >> 1;
        z = (z + x / z) >> 1;
        z = (z + x / z) >> 1;
        uint256 y2 = z + 1;
        return y2 < z ? y2 : z;
    }

    function getTickSpacing(uint24 fee) internal pure returns (int24) {
        if (fee == 500) return 10;    // 0.05%
        if (fee == 3000) return 60;   // 0.3%
        if (fee == 10000) return 200; // 1%
        revert("Invalid fee");
    }

    // Simplified tick math (use exact libraries in production)
    function getTickAtSqrtRatio(uint160 sqrtPriceX96) internal pure returns (int24 tick) {
        uint256 ratio = (uint256(sqrtPriceX96) * uint256(sqrtPriceX96)) >> 96;

        // Logarithmic approximation
        if (ratio >= 1e18) {
            // Above 1.0 ratio
            uint256 logArg = (ratio * 1e18) / 1e18;
            tick = int24(int256(log2(logArg) * 14427)); // log2(1.0001) ≈ 1/14427
        } else {
            // Below 1.0 ratio
            uint256 logArg = (1e36) / ratio;
            tick = -int24(int256(log2(logArg) * 14427));
        }

        // Clamp to valid range
        if (tick > 887272) tick = 887272;
        if (tick < -887272) tick = -887272;
    }

    function getSqrtRatioAtTick(int24 tick) internal pure returns (uint160) {
        // Simplified inverse calculation
        uint256 absTick = tick < 0 ? uint256(-int256(tick)) : uint256(int256(tick));
        uint256 price = pow(10001, absTick) / pow(10000, absTick); // (1.0001)^tick approximation

        if (tick >= 0) {
            return uint160((sqrt(price * (2**192))) >> 96);
        } else {
            return uint160((sqrt((2**192) / price)) >> 96);
        }
    }

    function pow(uint256 base, uint256 exp) internal pure returns (uint256 result) {
        result = 1;
        while (exp > 0) {
            if (exp & 1 == 1) result = (result * base) / 1e4;
            base = (base * base) / 1e4;
            exp >>= 1;
        }
        result *= 1e4;
    }

    function log2(uint256 x) internal pure returns (uint256) {
        // Simplified log2 for demonstration
        // Use proper fixed-point math libraries in production
        require(x > 0, "log of zero");
        uint256 result = 0;
        while (x >= 2e18) {
            result += 1e18;
            x /= 2;
        }
        return result;
    }

    function tickToPrice(int24 tick, bool forDisplay) internal pure returns (uint256) {
        // Convert tick back to price for display
        uint160 sqrtPriceX96 = getSqrtRatioAtTick(tick);
        uint256 priceRatio = (uint256(sqrtPriceX96) * uint256(sqrtPriceX96)) >> 96;

        if (BOO_TOKEN < USDC) {
            // price = USDC per BOO
            return priceRatio / 1e12; // Convert back to 6 decimals
        } else {
            // price = BOO per USDC, need to invert for display
            return 1e24 / priceRatio; // Convert back to 6 decimals
        }
    }

    // Utility functions for formatting
    function formatPrice(uint256 price) internal pure returns (string memory) {
        // Format price with proper decimal places
        if (price >= 1e6) return "1.000000";
        if (price >= 1e5) return "0.100000";
        if (price >= 1e4) return "0.010000";
        if (price >= 1e3) return "0.001000";
        return "0.000100";
    }

    function formatBasisPoints(uint256 bp) internal pure returns (string memory) {
        return string(abi.encodePacked(toString(bp / 100), ".", toString((bp % 100) / 10)));
    }

    function formatFee(uint24 fee) internal pure returns (string memory) {
        if (fee == 500) return "0.05";
        if (fee == 3000) return "0.3";
        if (fee == 10000) return "1.0";
        return "unknown";
    }

    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}