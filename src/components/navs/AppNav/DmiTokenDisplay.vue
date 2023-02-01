<script setup lang="ts">
import { coingeckoService } from '@/services/coingecko/coingecko.service';

const dmiTokenPrice = await coingeckoService.prices.getTokens([
  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
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
      {{ dmiTokenPrice['0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984']['usd'] }}
    </span>
  </suspense>
</template>