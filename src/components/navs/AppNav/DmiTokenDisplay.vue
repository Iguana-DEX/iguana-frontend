<script setup lang="ts">
import { coingeckoService } from '@/services/coingecko/coingecko.service';

const dmiTokenPrice = await coingeckoService.prices.getTokens([
  '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
]);
</script>

<template>
  <img
    class="pt-0 transition transform hover:scale-110 cursor-pointer"
    src="@/assets/images/dmi_icon.webp"
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