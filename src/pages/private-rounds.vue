<script setup lang="ts">
import PrivateRoundsPageHero from '@/components/heros/PrivateRoundsPageHero.vue';
import useNetwork from '@/composables/useNetwork';
// import useWeb3 from '@/services/web3/useWeb3';
import useBreakpoints from '@/composables/useBreakpoints';
import { useRouter } from 'vue-router';
// import { ref, onBeforeMount } from 'vue';

import { buildNetworkIconURL } from '@/lib/utils/urls';

import InlineMessage from 'primevue/message';
import Card from 'primevue/card';
import ProgressBar from 'primevue/progressbar';
import Button from 'primevue/button';

import { DecimalPrecision } from '../../src/components/utils';

// COMPOSABLES
// const sdk = new ThirdwebSDK('binance-testnet');
const { networkSlug, networkConfig } = useNetwork();
const router = useRouter();
// const { isWalletReady } = useWeb3(); // Can also import appNetworkConfig here
const { upToMediumBreakpoint } = useBreakpoints();

/**
 * METHODS
 */
const Status = {
  NotStarted: 'Starting soon',
  Ongoing: 'Ongoing',
  Success: 'Successful',
  Fail: 'Failed - not enough pledgers',
};

// if (isWalletReady) {
//   const contract = await sdk.getContract(
//     '0xbaE1808adBCf28802d655586dc186167602bDb46' // PrivateRounds contract on BSC Testnet
//   );
// }

const investmentRounds = [
  {
    id: 0,
    title: 'Reflexer',
    image:
      'https://pbs.twimg.com/profile_banners/1301830415821549570/1631540867/1500x500',
    start: 1679372202,
    end: 1698772322,
    story: 'Lorem ipsum',
    goal: 0,
    allocation: 50000,
    totalEthPledged: 0,
    status: Status.Ongoing,
    progress: 0,
  },
  {
    id: 1,
    title: 'TapiocaDAO',
    image:
      'https://pbs.twimg.com/profile_images/1617018174951628800/x0CTwRDs_400x400.jpg',
    start: 1678372202,
    end: 1681072202,
    story: 'Lorem ipsum',
    goal: 0,
    allocation: 100000,
    totalEthPledged: 60000,
    status: Status.Ongoing,
    progress: 0,
  },
  {
    id: 2,
    title: 'IguanaDEX',
    image: 'https://www.iguanadex.com/assets/logo-dark-a5132faa.webp',
    start: 1678372202,
    end: 1678372322,
    story: 'Lorem ipsum',
    goal: 0,
    allocation: 500000,
    totalEthPledged: 500000,
    status: Status.Ongoing,
    progress: 0,
  },
  {
    id: 3,
    title: 'GigaSwap',
    image: 'https://pbs.twimg.com/profile_banners/33825920/1676805443/1500x500',
    start: 1678372202,
    end: 1678372322,
    story: 'Lorem ipsum',
    goal: 50000,
    allocation: 50000,
    totalEthPledged: 25000,
    status: Status.Ongoing,
    progress: 0,
  },
];

for (let i = 0; i < investmentRounds.length; i++) {
  const currentDate = Math.round(Date.now() / 1e3);

  if (currentDate < investmentRounds[i].start) {
    investmentRounds[i].status = Status.NotStarted;
  } else if (currentDate > investmentRounds[i].end) {
    if (investmentRounds[i].totalEthPledged < investmentRounds[i].goal) {
      //  && pledged < allocation
      investmentRounds[i].status = Status.Fail;
    } else {
      investmentRounds[i].status = Status.Success;
    }
  } else {
    investmentRounds[i].progress = Math.round(
      (investmentRounds[i].totalEthPledged / investmentRounds[i].allocation) *
        100
    );
  }
}

/**
 * METHODS
 */
function navigateToCreatePool() {
  router.push({ name: 'create-pool', params: { networkSlug } });
}

function formatAmount(num: number) {
  if (num > 1000000) {
    return DecimalPrecision.round(num / 1e6, 1).toString() + 'm';
  }
  if (num > 2000) {
    return Math.round(num / 1e3).toString() + 'k';
  }

  return num;
}

function getTimeLeft(dateTime: number) {
  const now = Math.round(Date.now()) / 1e3;
  const timeDiffSecs = Math.abs(dateTime - now);

  const timeDiffDays = timeDiffSecs / (60 * 60 * 24);
  const days = Math.trunc(timeDiffDays);
  const hours = Math.round((timeDiffDays - days) * 24);

  if (days > 3) {
    return days + ' days';
  } else if (days > 0) {
    return days + ' days and ' + hours + ' hours';
  } else {
    return hours + ' hours';
  }
}
</script>

<template>
  <div>
    <PrivateRoundsPageHero />
    <div class="xl:container xl:px-4 pt-10 md:pt-12 xl:mx-auto mt-20">
      <BalStack vertical>
        <div class="px-4 xl:px-0">
          <div class="flex justify-start items-center mb-8 space-x-2.5">
            <h3>{{ $t('privateInvestmentRounds') }} on</h3>
            <img
              :src="buildNetworkIconURL(networkConfig.chainId)"
              :alt="networkConfig.chainName"
              class="mr-0 w-7 h-7 rounded-full"
            />
            <h3>{{ networkConfig.chainName }}</h3>
            <div
              v-if="!upToMediumBreakpoint"
              class="absolute right-0 pr-10 space-x-2.5"
            >
              <BalBtn
                color="transparent-blue"
                size="sm"
                outline
                :class="{ 'mt-4': upToMediumBreakpoint }"
                @click="navigateToCreatePool"
              >
                {{ $t('createRound') }}
              </BalBtn>
              <BalBtn
                color="transparent-blue"
                size="sm"
                outline
                :class="{ 'mt-4': upToMediumBreakpoint }"
                @click="navigateToCreatePool"
              >
                {{ $t('manageMembers') }}
              </BalBtn>
            </div>
          </div>
        </div>
        <div
          v-if="upToMediumBreakpoint"
          class="absolute left-14 mt-7 space-x-2.5"
        >
          <BalBtn
            color="transparent-blue"
            size="sm"
            outline
            :class="{ 'mt-4': upToMediumBreakpoint }"
            @click="navigateToCreatePool"
          >
            {{ $t('createARound') }}
          </BalBtn>
          <BalBtn
            color="transparent-blue"
            size="sm"
            outline
            :class="{ 'mt-4': upToMediumBreakpoint }"
            @click="navigateToCreatePool"
          >
            {{ $t('manageMembers') }}
          </BalBtn>
        </div>
        <!-- <div v-if="upToMediumBreakpoint" class="absolute right-14 mt-7">
          <BalBtn
            color="transparent-blue"
            size="sm"
            outline
            :class="{ 'mt-4': upToMediumBreakpoint }"
            @click="navigateToCreatePool"
          >
            {{ $t('createARound') }}
          </BalBtn> -->
        <!-- </div> -->
      </BalStack>
      <div
        class="flex flex-wrap gap-5 justify-center content-end items-stretch"
      >
        <div
          v-for="(round, index) in Object.entries(investmentRounds)"
          :key="index"
        >
          <Card class="card">
            <template #header>
              <InlineMessage
                v-if="round[1].status == Status.Ongoing"
                :style="{
                  border: 'solid #2b75ff',
                  borderWidth: '0 0 0 6px',
                  // color: '#696cff',
                }"
                severity="info"
                icon="pi-play"
                :closable="false"
                class="w-full border-primary justify-content-start"
              >
                <div class="flex align-items-center">
                  <div class="ml-2">{{ round[1].status }}</div>
                </div>
              </InlineMessage>
              <InlineMessage
                v-else-if="round[1].status == Status.NotStarted"
                :style="{
                  border: 'solid #2b75ff',
                  borderWidth: '0 0 0 0px',
                  // color: '#696cff',
                }"
                severity="warn"
                icon="pi-stopwatch"
                :closable="false"
                class="w-full border-primary justify-content-start"
              >
                <div class="flex align-items-center">
                  <div class="ml-2">{{ round[1].status }}</div>
                </div>
              </InlineMessage>
              <InlineMessage
                v-else-if="round[1].status == Status.Success"
                :style="{
                  border: 'solid #2b75ff',
                  borderWidth: '0 0 0 0px',
                  // color: '#696cff',
                }"
                severity="success"
                icon="pi-check-circle"
                :closable="false"
                class="w-full border-primary justify-content-start"
              >
                <div class="flex align-items-center">
                  <div class="ml-2">{{ round[1].status }}</div>
                </div>
              </InlineMessage>
              <InlineMessage
                v-else
                :style="{
                  border: 'solid #2b75ff',
                  borderWidth: '0 0 0 0px',
                  // color: '#696cff',
                }"
                severity="error"
                icon="pi-times-circle"
                :closable="false"
                class="w-full border-primary justify-content-start"
              >
                <div class="flex align-items-center">
                  <div class="ml-2">{{ round[1].status }}</div>
                </div>
              </InlineMessage>
              <img alt="Project image" class="max-h-32" :src="round[1].image" />
            </template>
            <template #title> {{ round[1].title }} </template>
            <template #subtitle>
              {{
                '$' + formatAmount(round[1].allocation) + ' group allocation'
              }}
            </template>
            <template #content>
              <p>
                {{ round[1].story }}
              </p>
              <div v-if="round[1].status == Status.Ongoing" class="mt-5">
                {{
                  '$' +
                  formatAmount(round[1].totalEthPledged) +
                  ' raised - ' +
                  getTimeLeft(round[1].end) +
                  ' left'
                }}
                <ProgressBar class="mt-5" :value="round[1].progress">
                </ProgressBar>
              </div>
              <InlineMessage
                v-else-if="round[1].status == Status.Success"
                :style="{
                  border: 'solid #2b75ff',
                  borderWidth: '0 0 0 0px',
                  // color: '#696cff',
                }"
                class="mt-0"
                :closable="false"
                icon="pi-angle-double-right"
                severity="success"
              >
                {{
                  'Raised $' +
                  formatAmount(round[1].totalEthPledged) +
                  ' from Members'
                }}
              </InlineMessage>
              <InlineMessage
                v-else-if="round[1].status == Status.NotStarted"
                :style="{
                  border: 'solid #2b75ff',
                  borderWidth: '0 0 0 0px',
                  // color: '#696cff',
                }"
                icon="pi pi-star"
                :closable="false"
                severity="warn"
              >
                {{ 'Starts in ' + getTimeLeft(round[1].start) }}
              </InlineMessage>
            </template>
            <template #footer>
              <div v-if="round[1].status == Status.Ongoing">
                <Button icon="pi pi-arrow-circle-up" label="Pledge" />
                <Button
                  icon="pi pi-times"
                  label="Unpledge"
                  severity="secondary"
                  style="margin-left: 0.5em"
                />
              </div>
              <div v-else-if="round[1].status == Status.Success">
                <Button icon="pi pi-arrow-circle-down" label="Claim tokens" />
              </div>
              <div v-else-if="round[1].status == Status.Fail">
                <Button
                  icon="pi pi-arrow-circle-down"
                  label="Get refund"
                  severity="secondary"
                  style="margin-left: 0.5em"
                />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.card {
  width: 25em;
  height: 40em;
}
</style>