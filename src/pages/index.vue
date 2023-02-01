<script setup lang="ts">
import { computed, ref, onBeforeMount } from 'vue';

import IndexTable from '@/components/tables/IndexTable/IndexTable.vue';
import HomePageHero from '@/components/heros/HomePageHero.vue';

import { coingeckoService } from '@/services/coingecko/coingecko.service';
import dmiComponents from '../data/dmi_current_weights.json';

function getAddressesString() {
  const addresses: string[] = [];
  for (let i = 0; i < dmiComponents.length; i++) {
    addresses.push(dmiComponents[i].address.toLowerCase());
  }

  return addresses;
}

const addresses = computed(() => getAddressesString());

let isDataReady = ref(false);

/**
 * METHODS
 */

/**
 * LIFECYCLE
 */
onBeforeMount(async () => {
  const response = await coingeckoService.prices.getTokensWithChange(
    addresses.value
  );
  const priceData = Object.fromEntries(
    Object.entries(response).map(([k, v]) => [k.toLowerCase(), v])
  );

  for (let i = 0; i < addresses.value.length; i++) {
    dmiComponents[i]['price'] = priceData[addresses.value[i]]['usd'];
    dmiComponents[i]['change24h'] =
      priceData[addresses.value[i]]['usd_24h_change'];
  }

  isDataReady.value = true;
});
</script>

<template>
  <div>
    <HomePageHero />
    <div class="xl:container xl:px-4 pt-10 md:pt-12 xl:mx-auto">
      <BalStack vertical>
        <h3 class="flex justify-between items-end mb-8">
          Composition of the Digital Market Index
        </h3>
        <suspense>
          <IndexTable
            v-if="isDataReady"
            :data="dmiComponents"
            :isLoading="false"
            class="mb-8"
            skeletonClass="pools-table-loading-height"
          />
        </suspense>
      </BalStack>
    </div>
  </div>
</template>

<style>
.pools-table-loading-height {
  height: 40rem;
}
</style>
