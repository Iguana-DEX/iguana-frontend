export interface TokenListMap {
  Balancer: {
    Default: string;
    Vetted: string;
  };
  External: string[];
}

interface TokenListMapByNetwork {
  [networkKey: string]: TokenListMap;
}

/**
 * Mapping of the TokenLists used on each network
 */
export const TOKEN_LIST_MAP: TokenListMapByNetwork = {
  '1': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/Iguana-DEX/assets/main/generated/homestead.listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/Iguana-DEX/assets/main/generated/homestead.vetted.tokenlist.json',
    },
    External: [
      'ipns://tokens.uniswap.org',
      'https://www.gemini.com/uniswap/manifest.json',
    ],
  },
  '5': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/Iguana-DEX/assets/main/generated/goerli.listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/Iguana-DEX/assets/main/generated/goerli.vetted.tokenlist.json',
    },
    External: [],
  },
  '10': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/Iguana-DEX/assets/main/generated/optimism.listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/Iguana-DEX/assets/main/generated/optimism.vetted.tokenlist.json',
    },
    External: [],
  },
  '56': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/iguana-dex/assets/main/generated/bsc.listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/iguana-dex/assets/main/generated/bsc.vetted.tokenlist.json',
    },
    External: [],
  },
  '97': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/iguana-dex/assets/main/generated/bsctestnet.listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/iguana-dex/assets/main/generated/bsctestnet.vetted.tokenlist.json',
    },
    External: [],
  },
  '137': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/Iguana-DEX/assets/main/generated/polygon.listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/Iguana-DEX/assets/main/generated/polygon.vetted.tokenlist.json',
    },
    External: [
      'https://unpkg.com/quickswap-default-token-list@1.0.67/build/quickswap-default.tokenlist.json',
    ],
  },
  '42161': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/Iguana-DEX/assets/main/generated/arbitrum.listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/Iguana-DEX/assets/main/generated/arbitrum.vetted.tokenlist.json',
    },
    External: [],
  },
};
