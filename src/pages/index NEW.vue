<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';

import IndexTable from '@/components/tables/IndexTable/IndexTable.vue';
import HomePageHero from '@/components/heros/HomePageHero.vue';

import { coingeckoService } from '@/services/coingecko/coingecko.service';
import dmiComponents from '../data/dmi_current_weights.json';
import coinsAddInfo from '../data/coins_additional_info.json';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// import ColumnGroup from 'primevue/columngroup';
// import Row from 'primevue/row';

import useNumbers from '@/composables/useNumbers';
import { useI18n } from 'vue-i18n';
import { formatBio } from '@/components/utils';
// import { CoinData } from '@/services/pool/types';

const addresses: string[] = [];
for (let i = 0; i < dmiComponents.length; i++) {
  addresses.push(dmiComponents[i].address.toLowerCase());
}

let isDataReady = ref(false);
// let priceData = ref({} as TokenPrices);

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const { fNum2 } = useNumbers();

/**
 * LIFECYCLE
 */
onBeforeMount(async () => {
  const response = await coingeckoService.prices.getTokensWithChangeNEW();

  console.log(response);
  // console.log(
  //   typeof response['0x1CE0c2827e2eF14D5C4f29a091d735A204794041']['usd'] // 0x1ce0c2827e2ef14d5c4f29a091d735a204794041
  // );
  // console.log(
  //   typeof response['0x1CE0c2827e2eF14D5C4f29a091d735A204794041'][
  //     'usd_24h_change'
  //   ]
  // );

  // const response = await coingeckoService.prices.getTokensWithChange(addresses);
  const priceData = Object.fromEntries(
    Object.entries(response).map(([k, v]) => [k.toLowerCase(), v])
  );

  for (let i = 0; i < addresses.length; i++) {
    dmiComponents[i]['price'] = priceData[addresses[i]]['usd'];
    dmiComponents[i]['change24h'] = priceData[addresses[i]]['usd_24h_change'];
  }

  isDataReady.value = true;

  console.log('data ready');
});

// function handleRowClick(coin: CoinData) {
//   // const route = router.resolve({
//   //   name: 'coin',
//   //   params: { id: coin.name },
//   // });
//   // inNewTab ? window.open(route.href) : router.push(route);
//   console.log(coin.name);
// }

function formatCoinChange(change) {
  change = Math.round(change * 10) / 10;
  const formattedChange = change.toString() + '%';

  return formattedChange;
}
</script>

<template>
  <div>
    <HomePageHero />
    <div class="xl:container xl:px-4 pt-10 md:pt-12 xl:mx-auto">
      <BalStack vertical>
        <h3 class="flex justify-between items-end mb-8">
          Composition of the Digital Market Index
        </h3>
        <DataTable
          v-if="isDataReady"
          sortField="realMarketCap"
          :sortOrder="-1"
          :value="dmiComponents"
          stripedRows
          selectionMode="single"
          tableStyle="min-width: 50rem"
        >
          <Column field="name" frozen :header="t('coin')">
            <template #body="{ data }">
              <img
                :src="coinsAddInfo[data.symbol].logoURI"
                :style="{
                  position: 'relative',
                  top: '10px',
                  width: '31px',
                  'padding-left': '8px',
                }"
              />
              <span
                :style="{
                  position: 'relative',
                  'white-space': 'nowrap',
                  bottom: '13px',
                  'font-weight': 'bold',
                  'font-size': '18px',
                  'padding-left': '40px',
                  'padding-right': '9px',
                }"
                >{{ data.name }}
              </span>
              <span
                :style="{
                  position: 'relative',
                  bottom: '14px',
                  color: '#a9aba9',
                  'font-size': '14px',
                }"
                >{{ data.symbol }}
              </span>
            </template>
          </Column>
          <Column field="weight" :header="t('weight')" sortable>
            <template #body="{ data }">
              {{
                fNum2(data.weight, {
                  style: 'percent',
                  maximumFractionDigits: 1,
                  fixedFormat: true,
                })
              }}
            </template>
          </Column>
          <Column field="price" :header="t('price')">
            <template #body="{ data }">
              {{
                fNum2(data.price, {
                  style: 'currency',
                  maximumFractionDigits: 2,
                  fixedFormat: false,
                })
              }}
            </template>
          </Column>
          <Column
            field="change24h"
            :header="t('change24h')"
            bodyStyle="text-align:left"
            sortable
          >
            <template #body="{ data }">
              <span v-if="data.change24h >= 0" class="text-green-400">
                {{ formatCoinChange(data.change24h) }}
              </span>
              <span v-if="data.change24h < 0" class="text-red-500">
                {{ formatCoinChange(data.change24h) }}
              </span>
            </template>
          </Column>
          <Column
            field="realMarketCap"
            :header="t('yPlus10MktCap')"
            bodyStyle="text-align:left"
            sortable
          >
            <template #body="{ data }">
              <div
                :key="data.realMarketCap"
                class="flex justify-end py-4 px-6 -mt-1 font-numeric"
              >
                <BalLoadingBlock v-if="!data?.realMarketCap" class="w-12 h-4" />
                <span v-else class="text-left">
                  {{ formatBio(data?.realMarketCap) }}
                </span>
              </div>
            </template>
          </Column>
        </DataTable>
        <Suspense>
          <IndexTable
            v-if="isDataReady"
            :data="dmiComponents"
            :isLoading="false"
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
