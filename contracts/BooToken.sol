// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

interface ILaunchGuard { function onPreTransferCheck(address from, address to, uint256 amount) external view; }
interface IReferralRegistry { function recordReferral(address buyer, bytes32 code, uint256 amount) external; }
interface IFeeRouter { function takeFee(address from, address to, uint256 amount) external returns (uint256); }

contract BooToken is ERC20, ERC20Permit, Ownable, Pausable {
    uint256 public immutable maxSupply; // e.g., 1e9 * 1e18
    ILaunchGuard public launchGuard;    // optional
    IReferralRegistry public referrals; // optional
    IFeeRouter public feeRouter;        // optional (default 0%)
    mapping(address => bool) public isDexPair;
    bool public tradingEnabled;

    event TradingEnabled(uint256 timestamp);
    event DexPairSet(address pair, bool enabled);

    constructor(uint256 _maxSupply) ERC20("Boo", "BOO") ERC20Permit("Boo") Ownable(msg.sender) {
        maxSupply = _maxSupply;
        _mint(msg.sender, _maxSupply);
        _pause(); // unpause at go‑live
    }

    function setDexPair(address pair, bool enabled) external onlyOwner { isDexPair[pair] = enabled; emit DexPairSet(pair, enabled); }
    function setLaunchGuard(address g) external onlyOwner { launchGuard = ILaunchGuard(g); }
    function setReferrals(address r) external onlyOwner { referrals = IReferralRegistry(r); }
    function setFeeRouter(address f) external onlyOwner { feeRouter = IFeeRouter(f); }

    function enableTrading() external onlyOwner { tradingEnabled = true; _unpause(); emit TradingEnabled(block.timestamp); }

    function _update(address from, address to, uint256 amount) internal override {
        if (paused()) revert("BOO: paused");
        if (address(launchGuard) != address(0)) { launchGuard.onPreTransferCheck(from, to, amount); }
        uint256 amt = amount;
        if (address(feeRouter) != address(0)) { amt -= feeRouter.takeFee(from, to, amount); }
        super._update(from, to, amt);
        // Lightweight referral signal on buys from pairs
        if (isDexPair[from] && address(referrals) != address(0)) {
            // Frontend passes code via separate tx -> registry matches buyer
            referrals.recordReferral(to, bytes32(0), amount);
        }
    }
}