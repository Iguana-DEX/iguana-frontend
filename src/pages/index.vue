<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';

import IndexTable from '@/components/tables/IndexTable/IndexTable.vue';
import HomePageHero from '@/components/heros/HomePageHero.vue';

import { coingeckoService } from '@/services/coingecko/coingecko.service';
import dmiComponents from '../data/dmi_current_weights.json';

// import { CoinData } from '@/services/pool/types';

const addresses: string[] = [];
for (let i = 0; i < dmiComponents.length; i++) {
  addresses.push(dmiComponents[i].address.toLowerCase());
}

let isDataReady = ref(true);
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
    dmiComponents[i]['price'] = priceData[addresses[i]]['usd'];
    dmiComponents[i]['change24h'] = priceData[addresses[i]]['usd_24h_change'];
  }

  isDataReady.value = false;
});

// function handleRowClick(coin: CoinData) {
//   // const route = router.resolve({
//   //   name: 'coin',
//   //   params: { id: coin.name },
//   // });
//   // inNewTab ? window.open(route.href) : router.push(route);
//   console.log(coin.name);
// }
</script>

<template>
  <div>
    <HomePageHero />
    <div class="xl:container xl:px-4 pt-10 md:pt-12 xl:mx-auto">
      <BalStack vertical>
        <h3 class="flex justify-between items-end mb-8">
          Composition of the Digital Market Index
        </h3>
        <Suspense>
          <IndexTable
            :data="dmiComponents"
            :isLoading="isDataReady"
            class="mb-8"
            skeletonClass="pools-table-loading-height"
          />
        </Suspense>
      </BalStack>
    </div>
  </div>
</template>

<style>
.pools-table-loading-height {
  height: 40rem;
}
</style>
