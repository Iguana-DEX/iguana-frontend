<script setup lang="ts">
import useWeb3 from '@/services/web3/useWeb3';
import HeroConnectWalletButton from '@/components/heros/HeroConnectWalletButton.vue';
import { buildNetworkIconURL } from '@/lib/utils/urls';

import Button from 'primevue/button';
import Card from 'primevue/card';

import { ref, watch, onBeforeMount } from 'vue';
import useNetwork from '@/composables/useNetwork';
import { useRouter } from 'vue-router';
import useBreakpoints from '@/composables/useBreakpoints';
import { configService } from '@/services/config/config.service';

import { request, gql } from 'graphql-request';
// import { useGroupStore } from '../store/GroupStore';

/** STATE */
const privateGroups = ref([] as GroupData[]);
const groupMemberships = ref([] as boolean[]);
const isLoading = ref(false);
const isGroupCreator = ref(false);

let contract;

/** TYPES */
type GroupData = {
  blockTimestamp: number;
  groupAddress: string;
  groupCreator: string;
  groupDescription: string;
  groupImageUrl: string;
  groupInfoUrl: string;
  groupName: string;
};

/** COMPOSABLES */
const { getSdk, isWalletReady, account } = useWeb3();
const { networkSlug, networkConfig } = useNetwork();
const router = useRouter();
const { upToMediumBreakpoint } = useBreakpoints();
// const groupStore = useGroupStore();

/** METHODS */
function navigateToPrivateRounds(_groupAddress: string) {
  router.push({
    name: 'private-rounds',
    params: { groupAddress: _groupAddress, networkSlug },
  });
}

function navigateToCreateGroup() {
  router.push({ name: 'create-group', params: { networkSlug } });
}

async function getContract(contractAddress: string) {
  if (isWalletReady) {
    const sdk = getSdk();
    contract = await sdk.getContract(contractAddress);
  }
}

/** LIFECYCLE METHODS */
onBeforeMount(async () => {
  if (!configService.network.subgraphs.privateGroups) {
    return;
  }

  isLoading.value = true;

  if (!contract) {
    await getContract(configService.network.addresses.privateGroupsFactory);
  }

  isGroupCreator.value = await contract.call(
    'hasRole',
    '0x0d8b58cba732a42811e1f217ab43cccb14f1a8263ebb61afbf13838fcdae9df9',
    account.value
  );

  await fetchGroups();
});

watch([account, networkSlug], async () => {
  if (!configService.network.subgraphs.privateGroups) {
    return;
  }

  isLoading.value = true;

  if (!contract) {
    await getContract(configService.network.addresses.privateGroupsFactory);
  }

  isGroupCreator.value = await contract.call(
    'hasRole',
    '0x0d8b58cba732a42811e1f217ab43cccb14f1a8263ebb61afbf13838fcdae9df9',
    account.value
  );

  await fetchGroups();
});

async function fetchGroups() {
  const groupsQuery = gql`
    {
      newGroupCreateds(
        first: 25
        skip: 0
        orderBy: groupId
        orderDirection: asc
      ) {
        groupId
        groupAddress
        groupCreator
      }
    }
  `;
  const groupInfoQuery = gql`
    {
      groupInfoChangeds(
        first: 75
        orderBy: blockTimestamp
        orderDirection: desc
      ) {
        groupId
        groupDescription
        groupImageUrl
        groupInfoUrl
        groupName
      }
    }
  `;

  Promise.all([
    request(configService.network.subgraphs.privateGroups, groupsQuery),
    request(configService.network.subgraphs.privateGroups, groupInfoQuery),
  ]).then(data => {
    const groups = data[0].newGroupCreateds;
    const groupInfo = data[1].groupInfoChangeds;

    privateGroups.value = [];

    for (let i = 0; i < groups.length; i++) {
      // Search groupInfo for groupId field with i value and return first one found
      const result = groupInfo.find(item => item.groupId === i.toString());

      // Merge both dicts and populate the privateGroups ref
      privateGroups.value.push({ ...groups[i], ...result });

      ![3, 4, 5, 6].includes(i)
        ? groupMemberships.value.push(true)
        : groupMemberships.value.push(false);

      console.log('i = ' + i.toString());
    }

    isLoading.value = false;
  });
}
</script>

<template>
  <div v-if="isWalletReady && configService.network.subgraphs.privateGroups">
    <div
      v-if="groupMemberships.includes(true) == false"
      class="flex justify-start items-center mt-5 mb-5 ml-5 space-x-2.5"
    >
      <h3>
        {{
          'You do not yet have access to any group. Request access to Iggies Club on our Discord/Twitter.'
        }}
      </h3>
    </div>
    <div
      v-else-if="upToMediumBreakpoint"
      class="flex justify-start items-center mt-5 mb-5 ml-5 space-x-2.5"
    >
      <h3>{{ 'You have access to the following groups:' }}</h3>
    </div>
    <div
      v-else
      class="flex justify-start items-center mt-5 mb-5 ml-5 space-x-2.5"
    >
      <h3>{{ 'You have access to the following groups on ' }}</h3>
      <img
        :src="buildNetworkIconURL(networkConfig.chainId)"
        :alt="networkConfig.chainName"
        class="mr-0 w-7 h-7 rounded-full"
      />
      <h3>{{ networkConfig.chainName }}:</h3>
    </div>
    <div class="absolute right-0 pr-10">
      <BalBtn
        v-if="isGroupCreator"
        color="transparent-blue"
        size="sm"
        outline
        :class="{ 'mt-4': upToMediumBreakpoint }"
        @click="navigateToCreateGroup"
      >
        {{ $t('createGroup') }}
      </BalBtn>
    </div>
    <BalLoadingBlock v-if="isLoading" class="mt-16 h-96" />
    <div
      v-else
      class="flex flex-wrap gap-7 justify-center content-end items-stretch mt-16"
    >
      <div v-for="(group, index) in Object.entries(privateGroups)" :key="index">
        <Card v-if="groupMemberships[index]" class="card">
          <template #header>
            <img
              alt="Project image"
              class="max-h-32 card-wrapper"
              :src="group[1].groupImageUrl"
            />
          </template>
          <template #title> {{ group[1].groupName }} </template>
          <template #content>
            <p>
              {{ group[1].groupDescription }}
            </p>
          </template>
          <template #footer>
            <div>
              <Button
                icon="pi pi-sign-in"
                label="View Rounds"
                @click="navigateToPrivateRounds(group[1].groupAddress)"
              />
              <a :href="group[1].groupInfoUrl" target="_blank" rel="noreferrer">
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
  <div
    v-else-if="!configService.network.subgraphs.privateGroups"
    class="text-center"
  >
    <div class="mt-20 text-xl font-semibold">
      <h3>
        The Private Groups feature is not available yet on
        {{ networkConfig.chainName }}:
      </h3>
      <div class="mt-5 text-md">
        => Switch to BNB Chain to check the Private Groups.
      </div>
    </div>
    <div class="mt-5 text-md">
      Feel free to request a deployment to {{ networkConfig.chainName }} on
      Discord or Twitter!
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
