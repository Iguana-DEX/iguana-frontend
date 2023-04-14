<script setup lang="ts">
import coinsAddInfo from '../../../data/coins_additional_info.json';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { ColumnDefinition } from '@/components/_global/BalTable/types';

// import MktCapTooltip from '@/components/tooltips/MktCapTooltip/MktCapTooltip.vue';
import useBreakpoints from '@/composables/useBreakpoints';
// import useDarkMode from '@/composables/useDarkMode';
// import { bnum } from '@/lib/utils';
import useNumbers from '@/composables/useNumbers';
import { CoinData } from '@/services/pool/types';

/**
 * TYPES
 */
type Props = {
  data?: Array<object>;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  noCoinsLabel?: string;
  isPaginated?: boolean;
  sortColumn?: string;
  hiddenColumns?: string[];
  columnStates?: Record<string, string>;
  skeletonClass?: string;
};

/**
 * PROPS & EMITS
 */

const props = withDefaults(defineProps<Props>(), {
  isLoadingMore: false,
  noCoinsLabel: 'No coins found',
  isPaginated: false,
  sortColumn: 'realMarketCap',
  hiddenColumns: () => [],
  columnStates: () => ({}),
  data: () => [],
  skeletonClass: 'h-64',
});

/**
 * COMPOSABLES
 */
const { fNum2 } = useNumbers();
// const router = useRouter();
const { t } = useI18n();
// const { darkMode } = useDarkMode();
const { upToLargeBreakpoint, upToMediumBreakpoint } = useBreakpoints();

const coinsWidth = computed(() => (upToMediumBreakpoint.value ? 190 : 90));
const weightsWidth = computed(() => (upToMediumBreakpoint.value ? 70 : 120));
const changeWidth = computed(() => (upToMediumBreakpoint.value ? 85 : 135));

/**
 * DATA
 */
const columns = computed<ColumnDefinition<CoinData>[]>(() => [
  {
    name: t('coin'),
    id: 'coin',
    accessor: 'name',
    Cell: 'coinCell',
    width: coinsWidth.value,
  },
  {
    name: t('weight'),
    // Cell: 'weightCell',
    accessor: coin =>
      fNum2(coin.weight, {
        style: 'percent',
        maximumFractionDigits: 1,
        fixedFormat: true,
      }),
    align: 'right',
    id: 'weight',
    sortKey: coin => {
      const weight = Number(coin?.weight);
      if (weight === Infinity || isNaN(weight)) return 0;
      return weight;
    },
    width: weightsWidth.value,
  },
  {
    name: t('change24h'),
    accessor: coin =>
      fNum2(coin.change24h / 100, {
        style: 'percent',
        maximumFractionDigits: 1,
        fixedFormat: true,
      }),
    align: 'right',
    id: 'change24h',
    Cell: 'changeCell',
    sortKey: coin => {
      const change24h = Number(coin?.change24h);
      if (change24h === Infinity || isNaN(change24h)) return 0;
      return change24h;
    },
    width: changeWidth.value,
    cellClassName: 'font-numeric',
  },
  {
    name: t('price'),
    accessor: coin =>
      fNum2(coin.price, {
        style: 'currency',
        maximumFractionDigits: 2,
        fixedFormat: false,
      }),
    align: 'right',
    id: 'price',
    sortKey: coin => Number(coin.price),
    width: 145,
    cellClassName: 'font-numeric',
  },
  {
    name: t('yPlus10MktCap'),
    accessor: 'realMarketCap',
    align: 'right',
    id: 'realMarketCap',
    Cell: 'mktCapCell',
    sortKey: coin => {
      const mktCap = Number(coin.realMarketCap);
      if (mktCap === Infinity || isNaN(mktCap)) return 0;
      return mktCap;
    },
    width: 155,
    cellClassName: 'font-numeric',
  },
]);

const visibleColumns = computed(() =>
  columns.value.filter(column => !props.hiddenColumns.includes(column.id))
);

/**
 * METHODS
 */
function handleRowClick(coin: CoinData) {
  // const route = router.resolve({
  //   name: 'coin',
  //   params: { id: coin.name },
  // });
  // inNewTab ? window.open(route.href) : router.push(route);
  console.log(coin.name);
}

function formatBio(dollarValue) {
  dollarValue /= 1e9;
  if (dollarValue <= 0) return '-';
  return '$' + Math.round(dollarValue) + ' bn';
}

function formatCoinChange(change) {
  change = Math.round(change * 10) / 10;
  const formattedChange = change.toString() + '%';

  return formattedChange;
}
</script>

<template>
  <BalCard
    shadow="lg"
    :square="upToLargeBreakpoint"
    :noBorder="upToLargeBreakpoint"
    noPad
  >
    <BalTable
      :columns="visibleColumns"
      :data="data"
      :noResultsLabel="noCoinsLabel"
      :isLoading="isLoading"
      :isLoadingMore="isLoadingMore"
      :skeletonClass="skeletonClass"
      sticky="both"
      :square="upToLargeBreakpoint"
      :onRowClick="handleRowClick"
      :isPaginated="isPaginated"
      :initialState="{
        sortColumn: sortColumn,
        sortDirection: 'desc',
      }"
    >
      <template #coinCell="coin">
        <div class="flex items-center">
          <div class="coin-data">
            <!-- <BalAsset
              :address="coin.address"
              :style="{
                position: 'relative',
                top: '4px',
                width: '25px',
              }"
            /> -->
            <img
              :src="coinsAddInfo[coin.symbol].logoURI"
              :alt="coin.symbol + ' logo'"
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
              >{{ coin.name }}
            </span>
            <span
              :style="{
                position: 'relative',
                bottom: '14px',
                color: '#a9aba9',
                'font-size': '14px',
              }"
              >{{ coin.symbol }}
            </span>
          </div>
        </div>
      </template>
      <template #changeCell="coin">
        <div
          :key="columnStates.change24h"
          class="flex justify-end py-4 px-6 -mt-1 text-right font-numeric"
        >
          <BalLoadingBlock v-if="!coin?.change24h" class="w-12 h-4" />
          <template v-else>
            <span v-if="coin.change24h >= 0" class="text-green-400">
              {{ formatCoinChange(coin.change24h) }}
            </span>
            <span v-if="coin.change24h < 0" class="text-red-500">
              {{ formatCoinChange(coin.change24h) }}
            </span>
            <!-- <APRTooltip v-if="coin?.apr" :pool="coin" /> -->
          </template>
        </div>
      </template>
      <template #mktCapCell="coin">
        <div
          :key="columnStates.realMarketCap"
          class="flex justify-end py-4 px-6 -mt-1 font-numeric"
        >
          <BalLoadingBlock v-if="!coin?.realMarketCap" class="w-12 h-4" />
          <span v-else class="text-right">
            {{ formatBio(coin?.realMarketCap) }}
          </span>
        </div>
      </template>
    </BalTable>
  </BalCard>
</template>
