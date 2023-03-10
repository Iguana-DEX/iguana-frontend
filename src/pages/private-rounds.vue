<script setup lang="ts">
import PrivateRoundsPageHero from '@/components/heros/PrivateRoundsPageHero.vue';
// import FeaturedProtocols from '@/components/sections/FeaturedProtocols.vue';
import useNetwork from '@/composables/useNetwork';
// import useWeb3 from '@/services/web3/useWeb3';

import { buildNetworkIconURL } from '@/lib/utils/urls';

import InlineMessage from 'primevue/message';
import Card from 'primevue/card';
import ProgressBar from 'primevue/progressbar';
import Button from 'primevue/button';

import { DecimalPrecision } from '../../src/components/utils';

// COMPOSABLES
// const { appNetworkConfig } = useWeb3();

const { networkConfig } = useNetwork();

/**
 * METHODS
 */
const Status = {
  NotStarted: 'Starting soon',
  Ongoing: 'Ongoing',
  Success: 'Successful',
  Fail: 'Failed - not enough pledgers',
};

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
    image: 'http://localhost:8080/src/assets/images/logo-light.webp',
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

function formatNumber(num: number) {
  if (num > 1000000) {
    return DecimalPrecision.round(num / 1e6, 1).toString() + 'm';
  }
  if (num > 2000) {
    return Math.round(num / 1e3).toString() + 'k';
  }

  return num;
}

function getTimeLeft(dateTime: number) {
  const now = Math.round(Date.now() / 1e3);
  const timeDiffSecs = Math.abs(dateTime - now);

  const timeDiffDays = timeDiffSecs / (60 * 60 * 24);
  const days = Math.round(timeDiffDays);
  const hours = (timeDiffDays - days) * 24;

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
            <!-- <BalBtn
              v-if="upToMediumBreakpoint"
              color="transparent-blue"
              size="sm"
              outline
              :class="{ 'mt-4': upToMediumBreakpoint }"
              @click="navigateToCreatePool"
            >
              {{ $t('createARound') }}
            </BalBtn> -->
          </div>

          <div
            class="flex flex-col md:flex-row justify-between items-end lg:items-center w-full"
          >
            <!-- <BalBtn
              v-if="!upToMediumBreakpoint"
              color="transparent-blue"
              size="sm"
              outline
              :class="{ 'mt-4': upToMediumBreakpoint }"
              :block="upToMediumBreakpoint"
              @click="navigateToCreatePool"
            >
              {{ $t('createARound') }}
            </BalBtn> -->
          </div>
        </div>
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
                '$' + formatNumber(round[1].allocation) + ' group allocation'
              }}
            </template>
            <template #content>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Inventore sed consequuntur error repudiandae numquam deserunt
                quisquam repellat libero asperiores earum nam nobis, culpa
                ratione quam perferendis esse, cupiditate neque quas!
              </p>
              <div v-if="round[1].status == Status.Ongoing" class="mt-5">
                {{
                  formatNumber(round[1].totalEthPledged) +
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
                  formatNumber(round[1].totalEthPledged) +
                  ' from Dewhales'
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
.grid-container-element {
  margin-top: 36px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
  width: 100%;
}

.card {
  width: 25em;
  height: 40em;
}
</style>