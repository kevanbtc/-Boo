# 🎃 $BOO Token Launch Guide

**Status**: Ready for Friends & Family Launch (Sep 22, 2025)

## 🚀 What's Been Implemented

### ✅ Enhanced Swap Module
- **QuickSwap Deep Link**: Primary CTA with prefilled BOO/USDC pair
- **Embedded 0x Swap**: Advanced option with real-time quotes
- **Wallet Integration**: Auto-connects to Polygon, handles approvals
- **Error Handling**: Graceful fallbacks and user feedback

### ✅ Referral Dashboard
- **Tier Tracking**: Real-time 30-day volume calculation
- **Smart Links**: Auto-generated with copy/QR/tweet functions
- **Tier Display**: Visual breakdown of all commission levels
- **On-chain Integration**: Reads directly from ReferralRegistry events

### ✅ LP Bootstrap Scripts
- **Price Calculator**: Precise sqrtPriceX96 and tick calculations
- **Bootstrap Script**: Automated pool creation and trading enablement
- **Safety Features**: Multi-step verification and slippage protection

---

## 🔥 Pre-Launch Checklist

### Phase 1: Final Testing (Before Sep 22)

- [ ] **Test Swap Module**
  - [ ] QuickSwap deep link opens correctly
  - [ ] 0x embedded swap handles small amounts ($25+ USDC)
  - [ ] Error messages are user-friendly
  - [ ] Toast notifications work

- [ ] **Test Referral Dashboard**
  - [ ] Wallet connection works on Polygon
  - [ ] Stats load correctly (may show 0 initially)
  - [ ] Link generation and copy functions work
  - [ ] QR code generation works
  - [ ] Tweet compose opens correctly

- [ ] **Verify Contract Integration**
  - [ ] All contract addresses are correct in HTML
  - [ ] RPC endpoints are responsive
  - [ ] PolygonScan links work

### Phase 2: LP Bootstrap Preparation

- [ ] **Calculate Launch Price**
  ```bash
  cd boo-halloween
  forge script script/PriceCalculator.s.sol --rpc-url $POLYGON_RPC_URL -vvvv
  ```

- [ ] **Choose Target Price** (recommended: $0.001)
  - Review calculator output
  - Select appropriate tick range (±2-3%)
  - Note sqrtPriceX96 values

- [ ] **Prepare Bootstrap Wallet**
  - [ ] Load with USDC for initial liquidity ($1,000+)
  - [ ] Ensure sufficient BOO tokens (1M+ BOO)
  - [ ] Verify private key in .env is funded

### Phase 3: Go-Live Sequence

**⚠️ CRITICAL: Execute in single transaction block if possible**

1. **Run Price Calculator**
   ```bash
   forge script script/PriceCalculator.s.sol --rpc-url $POLYGON_RPC_URL -vvvv
   ```

2. **Update Bootstrap Script** with chosen values

3. **Execute LP Bootstrap**
   ```bash
   forge script script/01_BootstrapLP.s.sol \
     --rpc-url $POLYGON_RPC_URL \
     --private-key $PRIVATE_KEY \
     --broadcast --verify \
     --etherscan-api-key $POLYGONSCAN_API_KEY -vvvv
   ```

4. **Verify Pool Creation**
   - [ ] Check pool address on PolygonScan
   - [ ] Confirm LP NFT deposited to LPVault
   - [ ] Verify trading is enabled
   - [ ] Test small swap on QuickSwap

5. **Update Website**
   - [ ] Replace any placeholder pool addresses
   - [ ] Verify buy buttons point to correct pool
   - [ ] Test end-to-end purchase flow

---

## 🎯 Launch Day Execution

### Hour 0: Pre-Launch
- [ ] Deploy site updates to Netlify
- [ ] Prepare ambassador notifications
- [ ] Queue social media posts

### Hour 1: LP Bootstrap
- [ ] Execute bootstrap script
- [ ] Verify all contracts are live
- [ ] Test first purchase manually
- [ ] Monitor PolygonScan for activity

### Hour 2: Ambassador Activation
- [ ] Send Top-50 their smart links
- [ ] Distribute QR codes for easy sharing
- [ ] Monitor referral dashboard for activity

### Hour 3-6: Active Monitoring
- [ ] Watch for large transactions
- [ ] Monitor gas fees and slippage
- [ ] Track burn mechanics
- [ ] Respond to community questions

---

## 🔧 Technical Configuration

### Contract Addresses (Polygon Mainnet)
```
BooToken:         0x550f4AF6E9466E4860c1E26509Df72EC30CF72AD
ReferralRegistry: 0xbeeE2b44Fa90F2E0A1c9240Fd5483292b2c52fbe
FeeRouter:        0x992f1e349741b5fA61fc7B0c901ee6e5959793Ca
LaunchGuard:      0x4A72158B8859Fc4C9Dd0eB0C593FF07EC5327048
LPVault:          0x99Bd41Cd52963C06e640A4d8b180982812E296A3

QuickSwap NFPM:   0xF6Ad3CcF71Abb3E12beCf6b3D2a74C963859ADCd
Native USDC:      0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359
```

### Key URLs
```
Buy (QuickSwap): https://quickswap.exchange/#/swap?currency0=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359&currency1=0x550f4AF6E9466E4860c1E26509Df72EC30CF72AD

PolygonScan:     https://polygonscan.com/address/0x550f4AF6E9466E4860c1E26509Df72EC30CF72AD
```

### Recommended Price Targets
- **Friends & Family**: $0.0001 - $0.001
- **Presale**: $0.001 - $0.01
- **Main Launch**: $0.01 - $0.1
- **Post-Launch**: Market determined

---

## 🔄 Post-Launch Operations

### Daily Monitoring
- [ ] Check burn statistics
- [ ] Monitor referral tier upgrades
- [ ] Track LP vault performance
- [ ] Review fee distribution

### Weekly Reviews
- [ ] Analyze top referrers
- [ ] Review tier adjustments if needed
- [ ] Plan ambassador rewards
- [ ] Assess liquidity needs

### Growth Strategies
- [ ] Scale successful referral patterns
- [ ] Introduce limited NFT releases
- [ ] Launch additional reward mechanics
- [ ] Expand to other DEXs if needed

---

## 🚨 Emergency Procedures

### If Trading Issues Occur
1. **Pause Token** (if critical): `BooToken.pause()`
2. **Disable Pairs**: `BooToken.setDexPair(pool, false)`
3. **Emergency Communication**: Update status page immediately

### If LP Issues Occur
1. **Check Vault Balance**: Ensure LP NFT is secure
2. **Monitor Slippage**: Watch for excessive price impact
3. **Add Liquidity**: If needed, mint additional positions

### Contact Information
- **Dev Team**: [Your contact]
- **Emergency Wallet**: [Multisig or secure wallet]
- **Community Manager**: [Discord/Telegram admin]

---

## 📊 Success Metrics

### Day 1 Targets
- [ ] 100+ unique buyers
- [ ] $10K+ trading volume
- [ ] 50+ referral links generated
- [ ] 0 critical bugs

### Week 1 Targets
- [ ] 1,000+ holders
- [ ] $100K+ trading volume
- [ ] 20+ Tier 3 referrers
- [ ] All ambassador slots filled

### Month 1 Targets
- [ ] 5,000+ holders
- [ ] $1M+ trading volume
- [ ] 5+ Tier 1 referrers
- [ ] Cross-DEX availability

---

*Ready to make BOO the spookiest success on Polygon! 🎃*

*Generated with Claude Code on September 22, 2025*