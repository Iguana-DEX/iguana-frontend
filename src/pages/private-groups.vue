<script setup lang="ts">
import useWeb3 from '@/services/web3/useWeb3';
import HeroConnectWalletButton from '@/components/heros/HeroConnectWalletButton.vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { ref } from 'vue';
import useNetwork from '@/composables/useNetwork';
import { useRouter } from 'vue-router';

// COMPOSABLES
const { isWalletReady } = useWeb3();
const { networkSlug } = useNetwork();
const router = useRouter();

// TYPES
type GroupData = {
  name: string;
  description?: string;
  image?: string;
  link: string;
  DEFAULT_ADMIN: string;
  bsc_address: string;
  polygon_address: string;
  arbitrum_address: string;
  optimism_address: string;
  avax_address: string;
  ethereum_address: string;
};

const privateGroups = ref([] as GroupData[]);

/**
 * METHODS
 */
async function getGroupsData() {
  const response = await fetch(
    'https://raw.githubusercontent.com/Iguana-DEX/assets/main/iguana_data/private_groups.json'
  );

  privateGroups.value = await response.json();
}

function navigateToPrivateRounds() {
  router.push({ name: 'private-rounds', params: { networkSlug } });
}

getGroupsData();

// get contracts of all groups
// check if member for all of them
// display the user's group
</script>

<template>
  <div v-if="isWalletReady" class="mt-10 ml-7">
    <h3>{{ 'You are a member of the following groups:' }}</h3>
    <div
      class="flex flex-wrap gap-7 justify-center content-end items-stretch mt-10"
    >
      <div v-for="(group, index) in Object.entries(privateGroups)" :key="index">
        <Card class="card">
          <template #header>
            <img
              alt="Project image"
              class="max-h-32 card-wrapper"
              :src="group[1].image"
            />
          </template>
          <template #title> {{ group[1].name }} </template>
          <!-- <template #subtitle>
            {{ '$' + formatAmount(group[1].allocation) + ' group allocation' }}
          </template> -->
          <template #content>
            <p>
              {{ group[1].description }}
            </p>
          </template>
          <template #footer>
            <div>
              <Button
                icon="pi pi-sign-in"
                label="View Rounds"
                @click="navigateToPrivateRounds"
              />
              <a :href="group[1].link" target="_blank" rel="noreferrer">
                <Button
                  icon="pi pi-arrow-up-right"
                  label="Learn More"
                  severity="secondary"
                  iconPos="right"
                  style="margin-left: 0.5em; font-size: 1rem"
                />
              </a>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
  <div v-else class="text-center">
    <div class="mt-20 text-xl font-semibold">
      {{ 'Please connect your wallet' }}
    </div>
    <div>
      {{ 'We will then display your groups' }}
    </div>
    <HeroConnectWalletButton class="mt-8" />
  </div>
</template>

<style>
.card {
  width: 25em;
  height: 22em;
}

.card-wrapper {
  aspect-ratio: 22 / 9;
}
</style>
