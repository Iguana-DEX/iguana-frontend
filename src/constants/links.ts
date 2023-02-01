export const EXTERNAL_LINKS = {
  Balancer: {
    Home: 'https://iguanadex.com',
    Analytics: 'https://dune.xyz/balancerlabs',
    BalForGas:
      'https://docs.balancer.finance/core-concepts/bal-balancer-governance-token/bal-for-gas',
    BugBounty: 'https://immunefi.com/bounty/balancer/',
    Docs: 'https://iguanadex.gitbook.io/iguanadex-docs/',
    Forum: 'https://forum.balancer.finance/',
    Grants: 'http://grants.balancer.community/',
    Social: {
      Discord: 'https://discord.gg/44VNyfNXVj',
      Github: 'https://github.com/iguana-dex',
      Medium: 'https://medium.com/iguana-dex',
      Linkedin: 'https://www.linkedin.com/company/iguana-dex',
      Twitter: 'https://twitter.com/IguanaDEX',
      Youtube: 'https://www.youtube.com/@IguanaDEX',
    },
    Vote: 'https://www.tally.xyz/group/iguanadex',
  },
  BNBChain: {
    Wallets: 'https://www.bnbchain.org/en/wallets',
  },
  Gauntlet: {
    Home: 'https://gauntlet.network',
  },
  Ethereum: {
    Wallets: 'https://ethereum.org/en/wallets',
  },
  Element: {
    Home: 'https://element.fi',
    Earn: 'https://app.element.fi/mint',
    Pools: {
      LUSD: 'https://app.element.fi/pools/0x56F30398d13F111401d6e7ffE758254a0946687d',
      USDC: 'https://app.element.fi/pools/0x7Edde0CB05ED19e03A9a47CD5E53fC57FDe1c80c',
    },
  },
  Copper: {
    Home: 'https://fjordfoundry.com/',
    Auctions: (poolAddress: string, networkPrefix = '') =>
      `https://${networkPrefix}copperlaunch.com/auctions/${poolAddress}`,
  },
  Tracer: {
    Home: 'https://mycelium.xyz/',
  },
  Sense: {
    Home: 'https://sense.finance/',
  },
  Multichain: {
    Home: 'https://multichain.org',
  },
};
