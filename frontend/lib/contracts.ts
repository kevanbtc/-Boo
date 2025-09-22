import { Address } from 'viem';

// Placeholder addresses - replace with deployed addresses
export const CONTRACT_ADDRESSES = {
  BooToken: '0x0000000000000000000000000000000000000000' as Address,
  ReferralRegistry: '0x0000000000000000000000000000000000000000' as Address,
  BooCostumeNFT: '0x0000000000000000000000000000000000000000' as Address,
  BooPoints: '0x0000000000000000000000000000000000000000' as Address,
  StakingManager: '0x0000000000000000000000000000000000000000' as Address,
  AirdropMerkle: '0x0000000000000000000000000000000000000000' as Address,
} as const;

// Placeholder ABIs - replace with actual ABIs from out/
export const BOO_TOKEN_ABI = [
  // ERC20 standard
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Add more as needed
] as const;

export const REFERRAL_REGISTRY_ABI = [
  {
    inputs: [{ name: 'code', type: 'bytes32' }],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'bytes32' }],
    name: 'codeOwner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'address' }],
    name: 'stats',
    outputs: [
      { name: 'volume', type: 'uint256' },
      { name: 'commissionAccrued', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const REFERRAL_REGISTRY_ADDRESS = CONTRACT_ADDRESSES.ReferralRegistry;

export const AIRDROP_MERKLE_ABI = [
  {
    inputs: [
      { name: 'claimant', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'proof', type: 'bytes32[]' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'address' }],
    name: 'claimed',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;