import axios from 'axios';
import { GasPrice } from './types';
import { bnum } from '@/lib/utils';
import { configService } from '@/services/config/config.service';
import { Network } from '@iguana-dex/sdk';

interface GoerliGasStationResponse {
  id: number;
  jsonrpc: string;
  result: string;
}

export default class GoerliProvider {
  public async getGasPrice(): Promise<GasPrice | null> {
    try {
      const { result } = await this.fetchGoerliProvider('eth_gasPrice');
      return {
        // price: Math.floor(bnum(result).toNumber() * GWEI_UNIT),
        // maxFeePerGas: Math.floor(data[txSpeed].maxFee * GWEI_UNIT),
        price: Math.floor(bnum(result).toNumber()),
        maxFeePerGas: Math.floor(bnum(result).toNumber()),
        maxPriorityFeePerGas: Math.floor(1500000000), // 1.5 GWEI
      };
    } catch (error) {
      console.log('[Goerli] Gas Platform Error', error);
      return null;
    }
  }

  private async fetchGoerliProvider(method: string) {
    const { data } = await axios.post<GoerliGasStationResponse>(
      configService.getNetworkRpc(Network.GOERLI),
      { method, id: 1, jsonrpc: '2.0' }
    );

    return data;
  }
}
