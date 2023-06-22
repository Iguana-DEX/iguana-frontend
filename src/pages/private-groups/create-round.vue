<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

import useWeb3 from '@/services/web3/useWeb3';
import useNetwork, { networkConfig } from '@/composables/useNetwork';

import { SmartContract } from 'node_modules/@thirdweb-dev/sdk/dist/declarations/src/evm/contracts/smart-contract';
import { configService } from '@/services/config/config.service';
import { request, gql } from 'graphql-request';

import useDarkMode from '@/composables/useDarkMode';

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { bnum } from '@/lib/utils';

/**
 * COMPOSABLES
 */
const { getSdk, isWalletReady } = useWeb3();
const { networkLabelMap, networkId, networkSlug } = useNetwork();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const { darkMode } = useDarkMode();

/** STATE */
const displayPopup = ref(false);
const popupHeader = ref('');
const paragraphContent = ref('');
const buttonColor = ref('');
// const isTxPending = ref(false);

const target = ref(0);
const groupAllocation = ref(0);

const startString = ref('19/09/2022 10:58');
const endString = ref('19/09/2022 10:58');
const roundTitle = ref('');
const roundStory = ref('');
const roundImageUrl = ref('');
const roundInfoUrl = ref('');

const groupAddress = (route.params.groupAddress as string).toLowerCase();

const roundsInfo = ref([] as RoundInfo[]);

const nativeAssetSymbol = configService.network.nativeAsset.symbol;

/** TYPES */
type RoundInfo = {
  roundTitle: string;
};

/** FUNCTIONS */
async function getContract(contractAddress: string): Promise<SmartContract> {
  let contract;

  if (isWalletReady) {
    const sdk = getSdk();
    contract = await sdk.getContract(contractAddress);
  }
  return contract;
}

async function fetchRounds() {
  const roundInfoQuery = gql`
    {
      roundInfoChangeds(
        first: 50
        orderBy: blockTimestamp
        orderDirection: desc
      ) {
        roundTitle
      }
    }
  `;

  request(networkConfig.subgraphs.privateGroups, roundInfoQuery).then(data => {
    roundsInfo.value = data.roundInfoChangeds;
  });
}

async function createRound(e) {
  e.preventDefault();

  const currentDate = Math.round(Date.now() / 1e3);
  const startAt = new Date(startString.value).getTime() / 1e3;
  if (startAt < currentDate) {
    showPopup(
      '!! Date Error !!',
      'The start date must be a date in the future.',
      'secondary'
    );
    return;
  }

  if (roundStory.value.length > 100) {
    showPopup(
      '!! Story Error !!',
      'The story paragraph must be shorter than 100 characters.',
      'secondary'
    );
    return;
  }

  await fetchRounds();

  const result = roundsInfo.value.find(
    item => item.roundTitle === roundTitle.value
  );

  if (result) {
    showPopup(
      '!! Cannot create round !!',
      'A round called ' + roundTitle.value + ' already exists',
      'secondary'
    );
  } else {
    const privateRoundsContract = await getContract(groupAddress);

    const unsubscribe = privateRoundsContract.events.addEventListener(
      'NewRoundCreated',
      event => {
        const roundId = event.data.roundId;
        showPopup(
          'Round created successfully',
          'Group members can now pledge money for the ' +
            roundTitle.value +
            ' round (round #' +
            roundId +
            ')',
          'success'
        );
        unsubscribe();
      }
    );

    // When the group below gets created, the event above will be fired
    await privateRoundsContract.call(
      'createNewRound',
      bnum(target.value).times(bnum(1e18)).toString(),
      bnum(groupAllocation.value).times(bnum(1e18)).toString(),
      bnum(groupAllocation.value).times(bnum(1e18)).toString(),
      new Date(startString.value).getTime() / 1e3,
      new Date(endString.value).getTime() / 1e3,
      roundTitle.value,
      roundStory.value,
      roundImageUrl.value,
      roundInfoUrl.value
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
        alt="Create Round"
      />
      <h2
        class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-300"
      >
        Private Round creation form
      </h2>
    </div>
    <form
      action="#"
      method="POST"
      class="mx-auto mt-16 sm:mt-20 max-w-xl"
      @submit="createRound"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        <div class="sm:col-span-2">
          <label
            for="name"
            class="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 required"
            >Title</label
          >
          <div class="mt-2.5">
            <input
              id="name"
              v-model="roundTitle"
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
            for="target"
            class="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 required"
            >Soft Cap (in {{ nativeAssetSymbol }})</label
          >
          <div class="mt-2.5">
            <input
              id="target"
              v-model="target"
              type="number"
              name="target"
              min="1"
              required
              class="block py-2 px-3.5 w-full sm:text-sm sm:leading-6 text-gray-900 placeholder:text-gray-400 bg-gray-200 dark:bg-gray-300 rounded-md border-0 ring-1 focus:ring-2 ring-inset focus:ring-inset ring-gray-300 focus:ring-indigo-600 shadow-sm"
            />
          </div>
        </div>
        <div class="sm:col-span-2">
          <label
            for="allocation"
            class="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 required"
            >Hard Cap (in {{ nativeAssetSymbol }})</label
          >
          <div class="mt-2.5">
            <input
              id="allocation"
              v-model="groupAllocation"
              type="number"
              name="allocation"
              :min="target"
              required
              class="block py-2 px-3.5 w-full sm:text-sm sm:leading-6 text-gray-900 placeholder:text-gray-400 bg-gray-200 dark:bg-gray-300 rounded-md border-0 ring-1 focus:ring-2 ring-inset focus:ring-inset ring-gray-300 focus:ring-indigo-600 shadow-sm"
            />
          </div>
        </div>
        <div class="sm:col-span-2">
          <label
            for="start"
            class="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 required"
            >Start (local time)</label
          >
          <div class="mt-2.5">
            <input
              id="start"
              v-model="startString"
              type="datetime-local"
              name="start"
              required
              class="block py-2 px-3.5 w-full sm:text-sm sm:leading-6 text-gray-900 placeholder:text-gray-400 bg-gray-200 dark:bg-gray-300 rounded-md border-0 ring-1 focus:ring-2 ring-inset focus:ring-inset ring-gray-300 focus:ring-indigo-600 shadow-sm"
            />
          </div>
        </div>
        <div class="sm:col-span-2">
          <label
            for="end"
            class="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 required"
            >End (local time)</label
          >
          <div class="mt-2.5">
            <input
              id="end"
              v-model="endString"
              type="datetime-local"
              name="end"
              required
              class="block py-2 px-3.5 w-full sm:text-sm sm:leading-6 text-gray-900 placeholder:text-gray-400 bg-gray-200 dark:bg-gray-300 rounded-md border-0 ring-1 focus:ring-2 ring-inset focus:ring-inset ring-gray-300 focus:ring-indigo-600 shadow-sm"
            />
          </div>
        </div>
        <div class="sm:col-span-2">
          <label
            for="description"
            class="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 required"
            >Story</label
          >
          <div class="mt-2.5">
            <textarea
              id="description"
              v-model="roundStory"
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
            >Image URL</label
          >
          <div class="mt-2.5">
            <input
              id="image"
              v-model="roundImageUrl"
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
            >Info Link URL</label
          >
          <div class="mt-2.5">
            <input
              id="link"
              v-model="roundInfoUrl"
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
          {{ t('createRoundOn') + ' ' + networkLabelMap[networkId] }}
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
</style>
