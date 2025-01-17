import { SUPPORTED_FIAT } from '@/constants/currency';

import { PriceService } from './api/price.service';
import { coingeckoClient } from './coingecko.client';

export const getNativeAssetId = (chainId: string): string => {
  const mapping = {
    '1': 'ethereum',
    '5': 'ethereum',
    '10': 'ethereum',
    '42': 'ethereum',
    '56': 'binancecoin',
    '97': 'binancecoin',
    '137': 'matic-network',
    '42161': 'ethereum',
  };

  return mapping[chainId] || 'binancecoin';
};

export const getPlatformId = (chainId: string): string => {
  const mapping = {
    '1': 'ethereum',
    '5': 'ethereum',
    '10': 'ethereum',
    '42': 'ethereum',
    '56': 'binance-smart-chain',
    '97': 'binance-smart-chain',
    '137': 'polygon-pos',
    '42161': 'arbitrum-one',
  };

  return mapping[chainId] || 'binance-smart-chain';
};

export class CoingeckoService {
  supportedFiat: string;
  prices: PriceService;

  constructor(
    public readonly client = coingeckoClient,
    priceServiceClass = PriceService
  ) {
    this.supportedFiat = SUPPORTED_FIAT.join(',');
    this.prices = new priceServiceClass(this);
  }
}

export const coingeckoService = new CoingeckoService();
