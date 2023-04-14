<script setup lang="ts">
import { coingeckoService } from '@/services/coingecko/coingecko.service';
import { TokenPrices } from '@/services/coingecko/api/price.service';

import { ref } from 'vue';

const dmiTokenPrice = ref(
  (await coingeckoService.prices.getDMIPrice(
    '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
  )) as TokenPrices
);
</script>

<template>
  <img
    class="pt-0 transition transform hover:scale-110 cursor-pointer"
    src="@/assets/images/dmi_icon.webp"
    alt="DMI token logo"
    width="35"
  />
  <suspense>
    <span
      v-if="dmiTokenPrice"
      class="pt-1 pr-2 text-lg font-bold cursor-pointer"
    >
      {{ dmiTokenPrice[Object.keys(dmiTokenPrice)[0]]['usd'] }}
    </span>
  </suspense>
</template>