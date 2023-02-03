import axios from 'axios';
import { GasPrice } from './types';
import { bnum } from '@/lib/utils';
import { configService } from '@/services/config/config.service';
import { Network } from '@iguana-dex/sdk';

interface BscGasStationResponse {
  id: number;
  jsonrpc: string;
  result: string;
}

export default class BscProvider {
  public async getGasPrice(): Promise<GasPrice | null> {
    try {
      const [gasPrice, gasEstimate] = await Promise.all([
        this.fetchBscProvider('eth_gasPrice'),
        this.fetchBscProvider('eth_estimateGas'),
      ]);
      const price = bnum(gasPrice.result).toNumber();
      const maxPriorityFeePerGas = bnum(gasEstimate.result).toNumber();

      return {
        price,
        maxPriorityFeePerGas,
      };
    } catch (error) {
      console.log('[BNB Chain] Gas Platform Error', error);
      return null;
    }
  }

  private async fetchBscProvider(method: string) {
    const { data } = await axios.post<BscGasStationResponse>(
      configService.getNetworkRpc(Network.BSC),
      { method, id: 1, jsonrpc: '2.0' }
    );

    return data;
  }
}
