const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  RPC_URL: 'https://polygon-mainnet.g.alchemy.com/v2/Vv2BaXEBOqRNaoHLJ-Pzt',
  FOUNDER_PRIVATE_KEY: '0x7b2b32f0d6f78140c8803bec4469978d9737d9bb458e95cef8c85bb912520b55',
  BOO_TOKEN: '0x550f4AF6E9466E4860c1E26509Df72EC30CF72AD',
  USDC_TOKEN: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  REFERRAL_REGISTRY: '0xbeeE2b44Fa90F2E0A1c9240Fd5483292b2c52fbe',
  BOO_PRICE: 0.001, // $0.001 per BOO
  REFERRAL_COMMISSION: 0.015, // 1.5% base commission
};

// Contract ABIs (minimal)
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

const REFERRAL_ABI = [
  'function recordReferral(address buyer, address referrer, uint256 amount) external',
  'event AffiliateCommission(address indexed referrer, uint256 volumeAfter, uint256 bpsApplied, uint256 commission)'
];

class FFProcessor {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(CONFIG.RPC_URL);
    this.wallet = new ethers.Wallet(CONFIG.FOUNDER_PRIVATE_KEY, this.provider);
    this.booContract = new ethers.Contract(CONFIG.BOO_TOKEN, ERC20_ABI, this.wallet);
    this.usdcContract = new ethers.Contract(CONFIG.USDC_TOKEN, ERC20_ABI, this.provider);
    this.referralContract = new ethers.Contract(CONFIG.REFERRAL_REGISTRY, REFERRAL_ABI, this.wallet);

    this.processedTxs = new Set();
    this.loadProcessedTxs();
  }

  // Load previously processed transactions
  loadProcessedTxs() {
    try {
      const processedFile = path.join(__dirname, 'processed_txs.json');
      if (fs.existsSync(processedFile)) {
        const processed = JSON.parse(fs.readFileSync(processedFile, 'utf8'));
        this.processedTxs = new Set(processed);
      }
    } catch (error) {
      console.log('No previous processed transactions found');
    }
  }

  // Save processed transaction
  saveProcessedTx(txHash) {
    this.processedTxs.add(txHash);
    const processedFile = path.join(__dirname, 'processed_txs.json');
    fs.writeFileSync(processedFile, JSON.stringify([...this.processedTxs], null, 2));
  }

  // Monitor for USDC transfers to founder wallet
  async startMonitoring() {
    console.log('🎃 Friends & Family Processor Started');
    console.log('Founder Wallet:', this.wallet.address);
    console.log('Monitoring USDC transfers...\n');

    // Listen for Transfer events to founder wallet
    const filter = this.usdcContract.filters.Transfer(null, this.wallet.address);

    this.usdcContract.on(filter, async (from, to, amount, event) => {
      await this.processPayment(from, amount, event.transactionHash);
    });

    // Also check recent transfers on startup
    await this.checkRecentTransfers();
  }

  // Check recent transfers (last 100 blocks)
  async checkRecentTransfers() {
    try {
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = currentBlock - 100;

      console.log(`Checking blocks ${fromBlock} to ${currentBlock} for recent payments...`);

      const filter = this.usdcContract.filters.Transfer(null, this.wallet.address);
      const events = await this.usdcContract.queryFilter(filter, fromBlock, 'latest');

      for (const event of events) {
        if (!this.processedTxs.has(event.transactionHash)) {
          await this.processPayment(event.args.from, event.args.value, event.transactionHash);
        }
      }
    } catch (error) {
      console.error('Error checking recent transfers:', error);
    }
  }

  // Process a USDC payment
  async processPayment(buyer, usdcAmount, txHash) {
    try {
      // Skip if already processed
      if (this.processedTxs.has(txHash)) {
        return;
      }

      console.log(`\n💰 Payment received: ${txHash}`);
      console.log(`From: ${buyer}`);
      console.log(`Amount: ${ethers.utils.formatUnits(usdcAmount, 6)} USDC`);

      // Calculate BOO amount
      const usdValue = parseFloat(ethers.utils.formatUnits(usdcAmount, 6));
      const booAmount = usdValue / CONFIG.BOO_PRICE;
      const booTokens = ethers.utils.parseEther(booAmount.toString());

      console.log(`BOO to send: ${booAmount.toLocaleString()} BOO`);

      // Check if we have enough BOO
      const booBalance = await this.booContract.balanceOf(this.wallet.address);
      if (booBalance.lt(booTokens)) {
        console.error('❌ Insufficient BOO balance!');
        this.logTransaction(txHash, buyer, usdValue, booAmount, 'INSUFFICIENT_BOO');
        return;
      }

      // Send BOO tokens
      console.log('📤 Sending BOO tokens...');
      const booTx = await this.booContract.transfer(buyer, booTokens, {
        gasLimit: 100000
      });

      console.log(`BOO transfer tx: ${booTx.hash}`);
      await booTx.wait();

      // Check for referrer and handle commission
      await this.handleReferral(buyer, usdValue, booAmount);

      // Mark as processed
      this.saveProcessedTx(txHash);
      this.logTransaction(txHash, buyer, usdValue, booAmount, 'SUCCESS', booTx.hash);

      console.log(`✅ Payment processed successfully!`);
      console.log(`${buyer} received ${booAmount.toLocaleString()} BOO\n`);

    } catch (error) {
      console.error('❌ Error processing payment:', error);
      this.logTransaction(txHash, buyer, 0, 0, 'ERROR', null, error.message);
    }
  }

  // Handle referral commissions
  async handleReferral(buyer, usdValue, booAmount) {
    try {
      // In a real implementation, you'd check your database for referrer
      // For now, we'll simulate checking localStorage data that might be submitted
      const referrer = this.getReferrerForBuyer(buyer);

      if (referrer && referrer !== buyer) {
        console.log(`🔗 Referral detected: ${referrer}`);

        // Record referral on-chain
        const booTokenAmount = ethers.utils.parseEther(booAmount.toString());
        const recordTx = await this.referralContract.recordReferral(
          buyer,
          referrer,
          booTokenAmount,
          { gasLimit: 150000 }
        );

        console.log(`Referral recorded: ${recordTx.hash}`);
        await recordTx.wait();

        // Calculate and send commission (1.5% of purchase in BOO)
        const commissionBOO = booAmount * CONFIG.REFERRAL_COMMISSION;
        const commissionTokens = ethers.utils.parseEther(commissionBOO.toString());

        if (commissionBOO > 0) {
          const commissionTx = await this.booContract.transfer(referrer, commissionTokens, {
            gasLimit: 100000
          });

          console.log(`💰 Commission sent: ${commissionBOO.toFixed(2)} BOO to ${referrer}`);
          console.log(`Commission tx: ${commissionTx.hash}`);
          await commissionTx.wait();
        }
      }
    } catch (error) {
      console.error('Error handling referral:', error);
    }
  }

  // Get referrer for buyer (placeholder - implement with your data source)
  getReferrerForBuyer(buyer) {
    // In production, this would check your database/API
    // For now, return null (no referrer)
    return null;
  }

  // Log transaction for record keeping
  logTransaction(paymentTxHash, buyer, usdValue, booAmount, status, booTxHash = null, error = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      paymentTxHash,
      buyer,
      usdValue,
      booAmount,
      status,
      booTxHash,
      error
    };

    const logFile = path.join(__dirname, 'ff_transactions.log');
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  }

  // Get status report
  async getStatus() {
    try {
      const booBalance = await this.booContract.balanceOf(this.wallet.address);
      const usdcBalance = await this.usdcContract.balanceOf(this.wallet.address);
      const polBalance = await this.provider.getBalance(this.wallet.address);

      console.log('\n=== F&F PROCESSOR STATUS ===');
      console.log(`BOO Balance: ${ethers.utils.formatEther(booBalance)} BOO`);
      console.log(`USDC Balance: ${ethers.utils.formatUnits(usdcBalance, 6)} USDC`);
      console.log(`POL Balance: ${ethers.utils.formatEther(polBalance)} POL`);
      console.log(`Processed Transactions: ${this.processedTxs.size}`);
      console.log(`BOO Available for Sale: ${(parseFloat(ethers.utils.formatEther(booBalance)) * CONFIG.BOO_PRICE).toLocaleString()} USD worth`);
      console.log('============================\n');
    } catch (error) {
      console.error('Error getting status:', error);
    }
  }
}

// Manual BOO send function
async function sendBOOManually(recipientAddress, booAmount, note = '') {
  try {
    const processor = new FFProcessor();
    const booTokens = ethers.utils.parseEther(booAmount.toString());

    console.log(`\n📤 Manual BOO Transfer`);
    console.log(`To: ${recipientAddress}`);
    console.log(`Amount: ${booAmount} BOO`);
    console.log(`Note: ${note}`);

    const tx = await processor.booContract.transfer(recipientAddress, booTokens, {
      gasLimit: 100000
    });

    console.log(`Transaction: ${tx.hash}`);
    await tx.wait();
    console.log(`✅ Transfer completed!`);

    // Log manual transfer
    processor.logTransaction('MANUAL', recipientAddress, 0, booAmount, 'MANUAL_TRANSFER', tx.hash, note);

  } catch (error) {
    console.error('❌ Manual transfer failed:', error);
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args[0] === 'monitor') {
    // Start monitoring
    const processor = new FFProcessor();
    processor.startMonitoring();

    // Status updates every 5 minutes
    setInterval(() => processor.getStatus(), 5 * 60 * 1000);

  } else if (args[0] === 'status') {
    // Get current status
    const processor = new FFProcessor();
    processor.getStatus();

  } else if (args[0] === 'send' && args[1] && args[2]) {
    // Manual send: node ff-processor.js send 0x... 1000 "Friends purchase"
    sendBOOManually(args[1], parseFloat(args[2]), args[3] || '');

  } else {
    console.log(`
🎃 BOO Friends & Family Processor

Usage:
  node ff-processor.js monitor     # Start monitoring payments
  node ff-processor.js status      # Check current status
  node ff-processor.js send <address> <amount> [note]  # Manual BOO transfer

Examples:
  node ff-processor.js monitor
  node ff-processor.js send 0x742d35Cc6634C0532925a3b844Bc454e4438f44e 25000 "VIP purchase"
    `);
  }
}

module.exports = { FFProcessor, sendBOOManually };