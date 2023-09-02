<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue';

import IndexTable from '@/components/tables/IndexTable/IndexTable.vue';
import HomePageHero from '@/components/heros/HomePageHero.vue';

import { coingeckoService } from '@/services/coingecko/coingecko.service';
import savComponents from '../data/dmi_current_weights.json';
import { useCoreDataStore } from '@/store/CoreDataStore';

// import { CoinData } from '@/services/pool/types';

import TradingViewChart from '@/components/charts/TradingViewChart.vue';

const addresses: string[] = [];
for (let i = 0; i < savComponents.length; i++) {
  addresses.push(savComponents[i].baseTokenAddressBSC.toLowerCase());
}

let isDataLoading = ref(true);

const coreDataStore = useCoreDataStore();

// let priceData = ref({} as TokenPrices);

/**
 * COMPOSABLES
 */

/**
 * LIFECYCLE
 */
onBeforeMount(async () => {
  const response = await coingeckoService.prices.getTokensWithChangeNEW();

  const priceData = Object.fromEntries(
    Object.entries(response).map(([k, v]) => [k.toLowerCase(), v])
  );

  for (let i = 0; i < addresses.length; i++) {
    savComponents[i]['price'] = priceData[addresses[i]]['usd'];
    savComponents[i]['change24h'] = priceData[addresses[i]]['usd_24h_change'];
  }

  isDataLoading.value = false;
});

watch(
  () => coreDataStore.selectedTicker,
  () => {
    componentKey.value += 1;
  }
);

const componentKey = ref(0);
</script>

<template>
  <div>
    <HomePageHero />
    <div class="xl:container xl:px-4 pt-10 md:pt-12 xl:mx-auto">
      <BalStack vertical>
        <h3 class="flex justify-between items-end mb-8">
          Composition of the Staked Asset Vault
        </h3>
        <Suspense>
          <IndexTable
            :data="savComponents"
            :isLoading="isDataLoading"
            class="mb-8"
            skeletonClass="pools-table-loading-height"
          />
        </Suspense>
      </BalStack>
      <TradingViewChart
        :key="componentKey"
        :ticker="coreDataStore.selectedTicker"
      />
    </div>
  </div>
</template>

<style>
.pools-table-loading-height {
  height: 40rem;
}
</style>
