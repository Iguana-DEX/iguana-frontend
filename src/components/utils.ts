const stablecoins = [
  'USDT',
  'USDC',
  'BUSD',
  'USDP',
  'LUSD',
  'RAI',
  'DAI',
  'HAY',
];

export function getActiveClassName<T>(state: T, classes: [T, string][]) {
  return (classes.find(_class => _class[0] === state) || [])[1] || '';
}

// HELPER FUNCTION
export const DecimalPrecision = (function () {
  if (Number.EPSILON === undefined) {
    Number.EPSILON = Math.pow(2, -52);
  }
  if (Math.sign === undefined) {
    Math.sign = function (x) {
      return (x > 0) - (x < 0) || +x;
    };
  }
  return {
    // Decimal round (half away from zero)
    round: function (num, decimalPlaces) {
      const p = Math.pow(10, decimalPlaces || 0);
      const n = num * p * (1 + Number.EPSILON);
      return Math.round(n) / p;
    },
    // Decimal ceil
    ceil: function (num, decimalPlaces) {
      const p = Math.pow(10, decimalPlaces || 0);
      const n = num * p * (1 - Math.sign(num) * Number.EPSILON);
      return Math.ceil(n) / p;
    },
    // Decimal floor
    floor: function (num, decimalPlaces) {
      const p = Math.pow(10, decimalPlaces || 0);
      const n = num * p * (1 + Math.sign(num) * Number.EPSILON);
      return Math.floor(n) / p;
    },
    // Decimal trunc
    trunc: function (num, decimalPlaces) {
      return (num < 0 ? this.ceil : this.floor)(num, decimalPlaces);
    },
    // Format using fixed-point notation
    toFixed: function (num, decimalPlaces) {
      return this.round(num, decimalPlaces).toFixed(decimalPlaces);
    },
  };
})();

export function formatBio(dollarValue) {
  dollarValue /= 1e9;
  if (dollarValue <= 0) return '-';
  return '$' + Math.round(dollarValue) + ' bn';
}

export function formatCoinChange(change) {
  change = Math.round(change * 10) / 10;
  const formattedChange = change.toString() + '%';

  return formattedChange;
}

export function formatAmount(num: number) {
  if (num > 1000000) {
    return DecimalPrecision.round(num / 1e6, 1).toString() + 'm';
  }
  if (num > 2000) {
    return Math.round(num / 1e3).toString() + 'k';
  }

  return num;
}

export function getTimeLeft(dateTime) {
  const now = Math.round(Date.now() / 1e3);
  const timeDiffSecs = Math.abs(dateTime - now);

  const timeDiffDays = timeDiffSecs / (60 * 60 * 24);
  const wholeDays = Math.trunc(timeDiffDays);

  if (wholeDays > 3) {
    return wholeDays + ' days';
  }

  const hours = (timeDiffDays - wholeDays) * 24;
  const wholeHours = Math.trunc(hours);

  if (wholeDays > 1) {
    if (wholeHours > 1) {
      return wholeDays + ' days and ' + wholeHours + ' hours';
    } else if (wholeHours == 1) {
      return wholeDays + ' days and 1 hour';
    } else {
      return wholeDays + ' days';
    }
  }

  if (wholeDays == 1) {
    if (wholeHours > 1) {
      return '1 day day and ' + wholeHours + ' hours';
    } else if (wholeHours == 1) {
      return '1 day and 1 hour';
    } else {
      return '1 day';
    }
  }

  const mins = (hours - wholeHours) * 60;
  const wholeMins = Math.trunc(mins);

  if (wholeHours > 1) {
    if (wholeMins > 1) {
      return wholeHours + ' hours and ' + wholeMins + ' minutes';
    } else if (wholeMins == 1) {
      return wholeHours + ' hours and 1 minute';
    } else {
      return wholeHours + ' hours';
    }
  }

  if (wholeHours == 1) {
    if (wholeMins > 1) {
      return '1 hour and ' + wholeMins + ' minutes';
    } else if (wholeMins == 1) {
      return '1 hour and 1 minute';
    } else {
      return '1 hour';
    }
  }

  if (wholeMins > 1) {
    return Math.round(mins) + ' minutes';
  } else if (mins >= 1) {
    return '1 minute';
  } else {
    return 'less than 1 minute';
  }
}

export function isStablecoin(symbol: string): boolean {
  return stablecoins.includes(symbol);
}

export const metamaskNetworkDetails = [
  {
    name: 'Ethereum Mainnet',
    chain: 'ETH',
    icon: 'ethereum',
    rpc: [
      'https://mainnet.infura.io/v3/${INFURA_API_KEY}',
      'wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}',
      'https://api.mycryptoapi.com/eth',
      'https://cloudflare-eth.com',
      'https://ethereum.publicnode.com',
    ],
    features: [{ name: 'EIP155' }, { name: 'EIP1559' }],
    faucets: [],
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    infoURL: 'https://ethereum.org',
    shortName: 'eth',
    chainId: '0x1',
    networkId: 1,
    slip44: 60,
    ens: { registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' },
    explorers: [
      {
        name: 'etherscan',
        url: 'https://etherscan.io',
        standard: 'EIP3091',
      },
    ],
  },
  {
    name: 'Binance Smart Chain Mainnet',
    chain: 'BSC',
    rpc: [
      'https://bsc-dataseed1.binance.org',
      'https://bsc-dataseed2.binance.org',
      'https://bsc-dataseed3.binance.org',
      'https://bsc-dataseed4.binance.org',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed2.defibit.io',
      'https://bsc-dataseed3.defibit.io',
      'https://bsc-dataseed4.defibit.io',
      'https://bsc-dataseed1.ninicoin.io',
      'https://bsc-dataseed2.ninicoin.io',
      'https://bsc-dataseed3.ninicoin.io',
      'https://bsc-dataseed4.ninicoin.io',
      'https://bsc.publicnode.com',
      'wss://bsc-ws-node.nariox.org',
    ],
    faucets: ['https://free-online-app.com/faucet-for-eth-evm-chains/'],
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    infoURL: 'https://www.binance.org',
    shortName: 'bnb',
    chainId: '0x38',
    networkId: 56,
    slip44: 714,
    explorers: [
      { name: 'bscscan', url: 'https://bscscan.com', standard: 'EIP3091' },
    ],
  },

  {
    name: 'Polygon Mainnet',
    chain: 'Polygon',
    icon: 'polygon',
    rpc: [
      'https://polygon-rpc.com/',
      'https://rpc-mainnet.matic.network',
      'https://matic-mainnet.chainstacklabs.com',
      'https://rpc-mainnet.maticvigil.com',
      'https://rpc-mainnet.matic.quiknode.pro',
      'https://matic-mainnet-full-rpc.bwarelabs.com',
      'https://polygon-bor.publicnode.com',
    ],
    faucets: [],
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    infoURL: 'https://polygon.technology/',
    shortName: 'matic',
    chainId: '0x89',
    networkId: 137,
    slip44: 966,
    explorers: [
      {
        name: 'polygonscan',
        url: 'https://polygonscan.com',
        standard: 'EIP3091',
      },
    ],
  },
  {
    name: 'Arbitrum One',
    chainId: '0xA4B1',
    shortName: 'arb1',
    chain: 'ETH',
    networkId: 42161,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpc: [
      'https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}',
      'https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}',
      'https://arb1.arbitrum.io/rpc',
    ],
    faucets: [],
    explorers: [
      {
        name: 'Arbiscan',
        url: 'https://arbiscan.io',
        standard: 'EIP3091',
      },
      {
        name: 'Arbitrum Explorer',
        url: 'https://explorer.arbitrum.io',
        standard: 'EIP3091',
      },
    ],
    infoURL: 'https://arbitrum.io',
    parent: {
      type: 'L2',
      chain: 'eip155-1',
      bridges: [{ url: 'https://bridge.arbitrum.io' }],
    },
  },
  {
    name: 'Goerli',
    title: 'Ethereum Testnet Goerli',
    chain: 'ETH',
    rpc: [
      'https://goerli.infura.io/v3/${INFURA_API_KEY}',
      'wss://goerli.infura.io/v3/${INFURA_API_KEY}',
      'https://rpc.goerli.mudit.blog/',
    ],
    faucets: [
      'http://fauceth.komputing.org?chain=5&address=${ADDRESS}',
      'https://goerli-faucet.slock.it?address=${ADDRESS}',
      'https://faucet.goerli.mudit.blog',
    ],
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://goerli.net/#about',
    shortName: 'gor',
    chainId: '0x5',
    networkId: 5,
    ens: { registry: '0x112234455c3a32fd11230c42e7bccd4a84e02010' },
    explorers: [
      {
        name: 'etherscan-goerli',
        url: 'https://goerli.etherscan.io',
        standard: 'EIP3091',
      },
    ],
  },
  {
    name: 'Binance Smart Chain Testnet',
    chain: 'BSC',
    rpc: [
      'https://data-seed-prebsc-1-s1.binance.org:8545',
      'https://data-seed-prebsc-2-s1.binance.org:8545',
      'https://data-seed-prebsc-1-s2.binance.org:8545',
      'https://data-seed-prebsc-2-s2.binance.org:8545',
      'https://data-seed-prebsc-1-s3.binance.org:8545',
      'https://data-seed-prebsc-2-s3.binance.org:8545',
    ],
    faucets: ['https://testnet.binance.org/faucet-smart'],
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'tBNB',
      decimals: 18,
    },
    infoURL: 'https://testnet.binance.org/',
    shortName: 'bnbt',
    chainId: '0x61',
    networkId: 97,
    explorers: [
      {
        name: 'bscscan-testnet',
        url: 'https://testnet.bscscan.com',
        standard: 'EIP3091',
      },
    ],
  },
];
