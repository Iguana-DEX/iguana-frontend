import { coingeckoService } from '@/services/coingecko/coingecko.service';

export default {
  async setup() {
    const dmiTokenPrice = await coingeckoService.prices.getTokens([
      '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    ]);

    return { dmiTokenPrice };
  },
};

// import CoinGecko from 'coingecko-api';

// const coinGeckoClient = new CoinGecko();

// const MAX_NUMBER_TOKEN = 10;
// const RECEIPT_TOKENS = ['USDT', 'USDC', 'BUSD', 'UST', 'STETH', 'DAI'];
// const NB_ONE = 1;
// const TOKEN_MAPPING_GROWTH = new Object();
// TOKEN_MAPPING_GROWTH['DOGECOIN'] = 1.0364 ** 10;

// function adjustFDV(token) {
//   token = token.toUpperCase();
//   return token in TOKEN_MAPPING_GROWTH ? TOKEN_MAPPING_GROWTH[token] : NB_ONE;
// }

// function computeRMC(dt) {
//   for (const coin in dt) {
//     dt[coin]['real_market_cap'] =
//       dt[coin]['name'].toUpperCase() in TOKEN_MAPPING_GROWTH
//         ? dt[coin]['circulating_supply'] *
//           adjustFDV(dt[coin]['name']) *
//           dt[coin]['current_price']
//         : dt[coin]['market_cap'];
//   }
//   return dt;
// }

// function filterCoins(dt, filterArray) {
//   const subdata = {};
//   for (const coin in dt) {
//     const coinSymbol = dt[coin]['symbol'].toUpperCase();
//     if (!filterArray.includes(coinSymbol)) {
//       subdata[coin] = dt[coin];
//     }
//   }
//   return subdata;
// }

// function sortCoinsByVolume(dt) {
//   const k_rmc = Object.keys(dt);
//   k_rmc.sort(function (a, b) {
//     return dt[b]['real_market_cap'] - dt[a]['real_market_cap'];
//   });
//   return k_rmc.map(key => {
//     return dt[key]['symbol'].toUpperCase();
//   });
// }

// function sortCoinsbyRMC(dt) {
//   const k_rmc = Object.keys(dt);
//   k_rmc.sort(function (a, b) {
//     return dt[b]['real_market_cap'] - dt[a]['real_market_cap'];
//   });
//   return k_rmc.map(key => {
//     return dt[key];
//   });
// }

// const formatPercent = (number: number) => `${new Number(number).toFixed(1)}%`;

// const formatDollar = (number, maximumSignificantDigits) =>
//   new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'usd',
//     maximumSignificantDigits,
//   }).format(number);

// const formatBio = t => `${t} Bn`;

// export default async function createCoinList() {
//   const params = {
//     order: CoinGecko.ORDER.MARKET_CAP_DESC,
//   };
//   let data = await coinGeckoClient.coins.markets({ params });
//   data = computeRMC(data);
//   data = filterCoins(data, RECEIPT_TOKENS);
//   const topCoinsbyVolume = sortCoinsByVolume(data);
//   data = filterCoins(data, topCoinsbyVolume.slice(20));
//   data = sortCoinsbyRMC(data);

//   return data;
// }
