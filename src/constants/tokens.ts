import { Network } from '@iguana-dex/sdk';

import { networkId } from '@/composables/useNetwork';
import { configService } from '@/services/config/config.service';

/**
 * TYPES
 */
type CommonTokens = {
  nativeAsset: string;
  wNativeAsset: string;
  WETH: string;
  BAL: string;
  bbaUSD?: string;
  bbaUSDv2?: string;
};

type TokenConstants = {
  Popular: {
    Symbols: string[];
  };
  Addresses: CommonTokens;
  PriceChainMap?: Record<string, string>;
};

/**
 * CONSTANTS
 */
export const NATIVE_ASSET_ADDRESS = configService.network.nativeAsset.address;
export const DEFAULT_TOKEN_DECIMALS = 18;

export const TOKENS_MAINNET: TokenConstants = {
  Popular: {
    Symbols: ['WBTC', 'DAI', 'USDC', 'BAL', 'AAVE', 'WETH'],
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    BAL: '0xba100000625a3754423978a60c9317c58a424e3d',
    bbaUSD: '0x7B50775383d3D6f0215A8F290f2C9e2eEBBEceb2',
    bbaUSDv2: '0xA13a9247ea42D743238089903570127DdA72fE44',
  },
};

export const TOKENS_POLYGON: TokenConstants = {
  Popular: {
    Symbols: ['WBTC', 'DAI', 'USDC', 'BAL', 'AAVE', 'WETH'],
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    WETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    BAL: '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3',
  },
};

export const TOKENS_ARBITRUM: TokenConstants = {
  Popular: {
    Symbols: ['WBTC', 'DAI', 'USDC', 'BAL', 'AAVE', 'WETH'],
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    BAL: '0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8',
  },
};

export const TOKENS_BSC: TokenConstants = {
  Popular: {
    Symbols: ['WBNB', 'MATIC', 'BUSD'],
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    WETH: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    BAL: '0x0000000000000000000000000000000000000000',
  },
};

export const TOKENS_GOERLI: TokenConstants = {
  Popular: {
    Symbols: ['WBTC', 'DAI', 'USDC', 'BAL', 'USDT', 'WETH'],
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1',
    WETH: '0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1',
    BAL: '0xfA8449189744799aD2AcE7e0EBAC8BB7575eff47',
    bbaUSD: '0x13ACD41C585d7EbB4a9460f7C8f50BE60DC080Cd',
  },
  PriceChainMap: {
    /**
     * Addresses must be lower case and map from goerli to mainnet, e.g
     * [goerli address]: mainnet address
     */
    '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1':
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    '0x37f03a12241e9fd3658ad6777d289c3fb8512bc9':
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    '0xfa8449189744799ad2ace7e0ebac8bb7575eff47':
      '0xba100000625a3754423978a60c9317c58a424e3d',
    '0xe0c9275e44ea80ef17579d33c55136b7da269aeb':
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0x8c9e6c40d3402480ace624730524facc5482798c':
      '0x6b175474e89094c44da98b954eedeac495271d0f',
    '0x1f1f156e0317167c11aa412e3d1435ea29dc3cce':
      '0xdac17f958d2ee523a2206206994597c13d831ec7',
    '0x4cb1892fddf14f772b2e39e299f44b2e5da90d04':
      '0x3ed3b47dd13ec9a98b44e6204a523e766b225811',
    '0x811151066392fd641fe74a9b55a712670572d161':
      '0xbcca60bb61934080951369a648fb03df4f96263c',
    '0x89534a24450081aa267c79b07411e9617d984052':
      '0x028171bca77440897b824ca71d1c56cac55b68a3',
    '0x829f35cebbcd47d3c120793c12f7a232c903138b':
      '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
    '0xff386a3d08f80ac38c77930d173fa56c6286dc8b':
      '0x6810e776880c02933d47db1b9fc05908e5386b96',
  },
};

export const TOKENS_BSCTESTNET: TokenConstants = {
  Popular: {
    Symbols: ['WBNB', 'USDT', 'MATIC'],
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0xE906CBeCd4A17DF62B8d6c8C82F3882af25295f5',
    WETH: '0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378',
    BAL: '0x0000000000000000000000000000000000000000',
  },
  PriceChainMap: {
    /**
     * Addresses must be lower case and map from bsc-testnet to bsc, e.g
     * [bsc-testnet address]: bsc address
     */
    // WBNB
    '0x9cC94f582B90013F1293635F1A71bc495D42801a':
      '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    // DAI
    '0xbf7E58B3d5315F9976294A0f27c87B9296b77074':
      '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    // USDC
    '0x06BB2D48a80f22CeDB3A82439dd05A11D94EEaa5':
      '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    // USDT
    '0x48BAE3f70680B7a30794d4E37cB0FDF08e2928e7':
      '0x55d398326f99059ff775485246999027b3197955',
    // BUSD
    '0x43159E6e6873C976E0236A39E6491Ea9a879BE6a':
      '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    // HAY
    '0x4576742e2c1DE84ad05a4763c865B6DFA27C1D44':
      '0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5',
    // BTC
    '0x274Dad29FFDab82900e814C56121318EF93cbC0E':
      '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
    // ETH
    '0x744516cf23546B86442CfCd0b7e288B53b0b7355':
      '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    // XRP
    '0x8696394C71E9719c695b21a346307FcCD53DEE4D':
      '0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe',
    // DOT
    '0x9a48ed91D5e7a44DA424e02A04f02E8cd6E6306a':
      '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
    // DOGE
    '0xe259Fc2CD7E8705b529787d579EFE640a10679df':
      '0xba2ae424d960c26247dd6c32edc70b295c744c43',
    // ADA
    '0x685088320cd2e41081E8306545eD0beDd90ef054':
      '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
    // AVAX
    '0x505e70b340Dec3a3bd17D5e8B8d7B898aC608e47':
      '0x1ce0c2827e2ef14d5c4f29a091d735a204794041',
    // MATIC
    '0x5aa1f4dC92f8576BA4b2Cd7A62D1AdDA87e10aE0':
      '0xcc42724c6683b7e57334c4e856f4c9965ed682bd',
    // LTC
    '0x5813CDcD8aa715175C4b12ECb869Ae5D23A994a4':
      '0x4338665cbb7b2485a8855a139b75d5e34ab0db94',
    // SHIB
    '0x922D9AAa08017619bcFE4D69d4d76De66135Fb88':
      '0x2859e4544c4bb03966803b044a93563bd2d0dd4d',
    // TRX
    '0xC0139A8C4042509D450983f013020c00b2204590':
      '0x85eac5ac2f758618dfa09bdbe0cf174e7d574d5b',
    // UNI
    '0xC7D7E72c631715eE5F5B1aaA2389FdcA59AB3785':
      '0xbf5140a22578168fd562dccf235e5d43a02ce9b1',
    // ATOM
    '0xF0de48630513Ad6a6d3B87a536B5798c48F5C3E1':
      '0x0eb3a705fc54725037cc9e008bdede697f62f335',
    // LINK
    '0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06':
      '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
    // EOS
    '0xb2FD17269b33b8828b5801B3E18115d3f2Fa5525':
      '0x56b6fb708fc5732dec1afc8d8556423a2edccbd6',
    // CAKE
    '0x9AF2E9C00f051687F8E49Bd2092cD8e810B9c535':
      '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    // BCH
    '0x6d81740A0AEF5ba3fa2c3ff8e49438D00a13AFEd':
      '0x8ff795a6f4d97e7887c79bea79aba5cc76444adf',
    // 1INCH
    '0x573b17462413d0ecB7be0302d0ad339b6f68888A':
      '0x111111111117dc0aa78b770fa6a738034120c302',
  },
};

export const TOKENS_GENERIC: TokenConstants = {
  Popular: {
    Symbols: ['WBTC', 'DAI', 'USDC', 'BAL', 'AAVE', 'WETH'],
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    WETH: '0x0000000000000000000000000000000000000000',
    BAL: '0x0000000000000000000000000000000000000000',
  },
};

const TOKENS_MAP = {
  [Network.GOERLI]: TOKENS_GOERLI,
  [Network.MAINNET]: TOKENS_MAINNET,
  [Network.POLYGON]: TOKENS_POLYGON,
  [Network.ARBITRUM]: TOKENS_ARBITRUM,
  [Network.BSC]: TOKENS_BSC,
  [Network.BSCTESTNET]: TOKENS_BSCTESTNET,
};

export const TOKENS: TokenConstants = TOKENS_MAP[networkId.value]
  ? TOKENS_MAP[networkId.value]
  : TOKENS_GENERIC;
