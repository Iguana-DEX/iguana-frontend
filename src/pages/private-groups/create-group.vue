<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import useWeb3 from '@/services/web3/useWeb3';
import useNetwork, { networkConfig } from '@/composables/useNetwork';

import { SmartContract } from 'node_modules/@thirdweb-dev/sdk/dist/declarations/src/evm/contracts/smart-contract';
import { configService } from '@/services/config/config.service';
import { request, gql } from 'graphql-request';

import useDarkMode from '@/composables/useDarkMode';

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

/**
 * STATE
 */
const displayPopup = ref(false);
const popupHeader = ref('');
const paragraphContent = ref('');
const buttonColor = ref('');

let groupAddress = '';
const groupName = ref('');
const groupDescription = ref('');
const groupImageUrl = ref('');
const groupInfoUrl = ref('');

const groupsInfo = ref([] as GroupInfo[]);

const isTxPending = ref(false);

/** TYPES */
type GroupInfo = {
  groupName: string;
};

/**
 * COMPOSABLES
 */
const { getSdk, isWalletReady } = useWeb3();
const { networkLabelMap, networkId, networkSlug } = useNetwork();
const { t } = useI18n();
const router = useRouter();

const { darkMode } = useDarkMode();

async function getContract(contractAddress: string): Promise<SmartContract> {
  let contract;

  if (isWalletReady) {
    const sdk = getSdk();
    contract = await sdk.getContract(contractAddress);
  }
  return contract;
}

/**
 * FUNCTIONS
 */
async function fetchGroups() {
  const groupInfoQuery = gql`
    {
      groupInfoChangeds(
        first: 50
        orderBy: blockTimestamp
        orderDirection: desc
      ) {
        groupName
      }
    }
  `;

  request(networkConfig.subgraphs.privateGroups, groupInfoQuery).then(data => {
    groupsInfo.value = data.groupInfoChangeds;
  });
}

async function add(e) {
  e.preventDefault();

  await fetchGroups();

  const result = groupsInfo.value.find(
    item => item.groupName === groupName.value
  );

  if (result) {
    showPopup(
      '!! Cannot create group !!',
      'A group called ' + groupName.value + ' already exists',
      'secondary'
    );
  } else {
    const privateGroupsFactory = await getContract(
      configService.network.addresses.privateGroupsFactory
    );

    const unsubscribe = privateGroupsFactory.events.addEventListener(
      'NewGroupCreated',
      event => {
        groupAddress = event.data.groupAddress;
        showPopup(
          'Group created successfully',
          'You can now add members and create new rounds for ' +
            groupName.value +
            ' (address: ' +
            groupAddress +
            ')',
          'success'
        );
        unsubscribe();
      }
    );

    // When the group below gets created, the event above will be fired
    await privateGroupsFactory.call(
      'createNewGroup',
      groupName.value,
      groupDescription.value,
      groupImageUrl.value,
      groupInfoUrl.value
    );
  }
}

function showPopup(_header, _paragraphContent, _buttonColor) {
  popupHeader.value = _header;
  paragraphContent.value = _paragraphContent;
  buttonColor.value = _buttonColor;

  displayPopup.value = true;
}

function hidePopup() {
  if (buttonColor.value == 'success') {
    router.push({
      name: 'private-rounds',
      params: { groupAddress: groupAddress, networkSlug },
    });
  } else {
    displayPopup.value = false;
  }
}
</script>

<template>
  <Dialog
    v-model:visible="displayPopup"
    :header="popupHeader"
    :style="{ width: '50vw' }"
  >
    <p>{{ paragraphContent }}</p>
    <template #footer>
      <Button
        label="OK"
        severity="success"
        icon="pi pi-check"
        @click="hidePopup"
      />
    </template>
  </Dialog>
  <div class="isolate py-24 sm:py-32 px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <img
        class="mx-auto w-auto h-12"
        src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
        alt="Create Group"
      />
      <h2
        class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-300"
      >
        Private Group creation form
      </h2>
    </div>
    <div v-if="isTxPending">
      <div
        class="mx-auto mt-20 w-20 h-20 rounded-full border-4 border-blue-600 loader"
      />
      <div class="flex justify-center mt-8 text-xl">Creating new group...</div>
      <div class="flex justify-center mt-4 text-gray-300 text-md">
        Transaction pending...
      </div>
    </div>
    <form
      v-else
      action="#"
      method="POST"
      class="mx-auto mt-16 sm:mt-20 max-w-xl"
      @submit="add"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        <div class="sm:col-span-2">
          <label
            for="name"
            class="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 required"
            >Group Name</label
          >
          <div class="mt-2.5">
            <input
              id="name"
              v-model="groupName"
              type="text"
              name="name"
              required
              placeholder="The DeFi OGs collective"
              class="block py-2 px-3.5 w-full sm:text-sm sm:leading-6 text-gray-900 placeholder:text-gray-400 bg-gray-200 dark:bg-gray-300 rounded-md border-0 ring-1 focus:ring-2 ring-inset focus:ring-inset ring-gray-300 focus:ring-indigo-600 shadow-sm"
            />
          </div>
        </div>
        <div class="sm:col-span-2">
          <label
            for="description"
            class="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 required"
            >Group Description</label
          >
          <div class="mt-2.5">
            <textarea
              id="description"
              v-model="groupDescription"
              name="description"
              required
              rows="4"
              placeholder="A cool new group for like-minded people to invest in XYZ.."
              class="block py-2 px-3.5 w-full sm:text-sm sm:leading-6 text-gray-900 placeholder:text-gray-400 bg-gray-200 dark:bg-gray-300 rounded-md border-0 ring-1 focus:ring-2 ring-inset focus:ring-inset ring-gray-300 focus:ring-indigo-600 shadow-sm"
            />
          </div>
        </div>
        <div class="sm:col-span-2">
          <label
            for="image"
            class="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 required"
            >Group Image URL</label
          >
          <div class="mt-2.5">
            <input
              id="image"
              v-model="groupImageUrl"
              type="text"
              name="image"
              required
              placeholder="https://www.iguanadex.com/assets/logo-dark-a5132faa.webp"
              class="block py-2 px-3.5 w-full sm:text-sm sm:leading-6 text-gray-900 placeholder:text-gray-400 bg-gray-200 dark:bg-gray-300 rounded-md border-0 ring-1 focus:ring-2 ring-inset focus:ring-inset ring-gray-300 focus:ring-indigo-600 shadow-sm"
            />
          </div>
        </div>
        <div class="sm:col-span-2">
          <label
            for="link"
            class="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 required"
            >Group Info Link URL</label
          >
          <div class="mt-2.5">
            <input
              id="link"
              v-model="groupInfoUrl"
              type="text"
              name="link"
              required
              placeholder="https://docs.iguanadex.com/"
              class="block py-2 px-3.5 w-full sm:text-sm sm:leading-6 text-gray-900 placeholder:text-gray-400 bg-gray-200 dark:bg-gray-300 rounded-md border-0 ring-1 focus:ring-2 ring-inset focus:ring-inset ring-gray-300 focus:ring-indigo-600 shadow-sm"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center mt-10">
        <BalBtn
          type="submit"
          :color="darkMode ? 'blue' : 'white'"
          class="py-2.5 px-3.5 w-auto text-sm"
        >
          {{ t('createGroupOn') + ' ' + networkLabelMap[networkId] }}
        </BalBtn>
      </div>
    </form>
  </div>
</template>

<style scoped>
.center-col-mh {
  min-height: 550px;
}

.required::after {
  content: ' *';
  color: red;
}

@keyframes loader-rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loader {
  border-right-color: transparent;
  animation: loader-rotate 1s linear infinite;
}
</style>
