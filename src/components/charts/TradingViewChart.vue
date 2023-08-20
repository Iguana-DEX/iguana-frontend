<script setup lang="ts">
import { ref } from 'vue';
import { Chart, Snaps } from 'vue-tradingview-widgets';
import useBreakpoints from '@/composables/useBreakpoints';

type Props = {
  ticker?: string;
};

const props = withDefaults(defineProps<Props>(), {
  ticker: 'BTC',
});

const symbol = ref('BITSTAMP:' + props.ticker + 'USD');
const snapsSymbol = ref(`${props.ticker}USD`);
const feedMode = ref('market');
const market = ref('crypto');

const { upToLargeBreakpoint } = useBreakpoints();

if (props.ticker == 'DMF') {
  symbol.value = 'BITSTAMP:BTCUSD';
  feedMode.value = 'symbol';
  market.value = '';
  snapsSymbol.value = '';
}
</script>

<template>
  <div class="container">
    <Chart
      :options="{
        autosize: false,
        height: '600',
        width: '900',
        symbol: symbol,
        interval: '5',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        hide_legend: true,
        allow_symbol_change: true,
        studies: [
          {
            id: 'MAExp@tv-basicstudies',
            inputs: {
              length: 7,
            },
          },
          {
            id: 'MAExp@tv-basicstudies',
            inputs: {
              length: 25,
            },
          },
          {
            id: 'MAExp@tv-basicstudies',
            inputs: {
              length: 99,
            },
          },
        ],
        save_image: false,
      }"
    />
    <Snaps
      v-if="!upToLargeBreakpoint"
      :options="{
        feedMode: feedMode,
        market: market,
        symbol: snapsSymbol,
        colorTheme: 'dark',
        isTransparent: false,
        displayMode: 'regular',
        width: 480,
        height: 600,
        locale: 'en',
      }"
    />
  </div>
</template>

<style>
.container {
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: space-evenly;
}
</style>