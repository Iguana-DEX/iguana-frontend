import axios from 'axios';
import { GasPrice } from './types';
import { bnum } from '@/lib/utils';
import { configService } from '@/services/config/config.service';
import { Network } from '@iguana-dex/sdk';

interface BsctestnetGasStationResponse {
  id: number;
  jsonrpc: string;
  result: string;
}

export default class BsctestnetProvider {
  public async getGasPrice(): Promise<GasPrice | null> {
    try {
      const [gasPrice, gasEstimate] = await Promise.all([
        this.fetchBsctestnetProvider('eth_gasPrice'),
        this.fetchGasEstimateProvider('eth_estimateGas'),
      ]);
      const price = bnum(gasPrice.result).toNumber();
      const maxPriorityFeePerGas = bnum(gasEstimate.result).toNumber() * 20;

      return {
        price,
        maxPriorityFeePerGas,
      };
    } catch (error) {
      console.log('[BSC Testnet] Gas Platform Error', error);
      return null;
    }
  }

  private async fetchBsctestnetProvider(method: string) {
    const { data } = await axios.post<BsctestnetGasStationResponse>(
      configService.getNetworkRpc(Network.BSCTESTNET),
      { method, id: 1, jsonrpc: '2.0' }
    );

    return data;
  }

  private async fetchGasEstimateProvider(method: string) {
    const { data } = await axios.post<BsctestnetGasStationResponse>(
      configService.getNetworkRpc(Network.BSCTESTNET),
      {
        method,
        id: 1,
        jsonrpc: '2.0',
        params: [{ to: '0xd46e8dd67c5d32be8058bb8eb970870f07244567' }],
      }
    );

    return data;
  }
}
