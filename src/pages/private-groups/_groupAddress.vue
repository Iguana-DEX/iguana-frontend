<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { ref, watch, onBeforeMount } from 'vue';
import { request, gql } from 'graphql-request';
import { ethers } from 'ethers';

import { buildNetworkIconURL } from '@/lib/utils/urls';
import { formatAmount, getTimeLeft } from '@/components/utils';
import { configService } from '@/services/config/config.service';
import PrivateRoundsPageHero from '@/components/heros/PrivateRoundsPageHero.vue';
import useNetwork from '@/composables/useNetwork';
import useWeb3 from '@/services/web3/useWeb3';
import useBreakpoints from '@/composables/useBreakpoints';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import InlineMessage from 'primevue/message';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import ProgressBar from 'primevue/progressbar';
import { bnum } from '@/lib/utils';

/** COMPOSABLES */
const { upToMediumBreakpoint } = useBreakpoints();
const { networkSlug, networkConfig } = useNetwork();
const router = useRouter();
const route = useRoute();
const { getSdk, isWalletReady, account } = useWeb3(); // Can also import appNetworkConfig here

/** TYPES */
type RoundData = {
  roundId: number;
  roundTitle: string;
  roundImageUrl: string;
  startAt: number;
  endAt: number;
  roundStory: string;
  target: number;
  totalEthPledged: number;
  groupAllocation: number;
  status: string;
  progress: number;
};

type RoundTokenInfo = {
  roundId: number;
  amount: number;
};

/** STATE */
let groupAddress = '';
let contract;

const isDefaultAdmin = ref(false);
const isMember = ref(false);
const isLoading = ref(true);
const isCheckingMembership = ref(false);
const privateRounds = ref([] as RoundData[]);

const isRoundStatusLoaded = ref([] as boolean[]);

const roundId = ref(0);
const tokenAddress = ref('');

const displayPopup = ref(false);
const popupHeader = ref('');
const amount = ref(0);

const nativeAssetSymbol = configService.network.nativeAsset.symbol;

const Status = {
  NotStarted: 'Starting soon',
  Ongoing: 'Ongoing',
  AwaitingTokens: 'Ended - awaiting tokens',
  TokensClaimable: 'Ended',
  Fail: 'Failed - collect refund',
};

/** LIFECYCLE METHODS */
onBeforeMount(async () => {
  isLoading.value = true;
  isCheckingMembership.value = true;

  groupAddress = (route.params.groupAddress as string).toLowerCase();
  contract = await getContract(groupAddress);

  isDefaultAdmin.value = await contract.call(
    'hasRole',
    '0x0000000000000000000000000000000000000000000000000000000000000000',
    account.value
  );

  if (isDefaultAdmin.value) {
    isMember.value = true;
  } else {
    isMember.value = await contract.call(
      'hasRole',
      '0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636',
      account.value
    );
  }

  isCheckingMembership.value = false;

  await fetchRounds();
});

watch(account, async () => {
  isLoading.value = true;
  isCheckingMembership.value = true;

  isDefaultAdmin.value = await contract.call(
    'hasRole',
    '0x0000000000000000000000000000000000000000000000000000000000000000',
    account.value
  );

  if (isDefaultAdmin.value) {
    isMember.value = true;
  } else {
    isMember.value = await contract.call(
      'hasRole',
      '0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636',
      account.value
    );
  }

  isCheckingMembership.value = false;

  await fetchRounds();
});

/** FUNCTIONS */
function navigateToCreateRound() {
  router.push({ name: 'create-round', params: { networkSlug } });
}

async function getContract(contractAddress: string) {
  let _contract;
  if (isWalletReady) {
    const sdk = getSdk();
    _contract = await sdk.getContract(contractAddress);
  }

  return _contract;
}

async function fetchRounds() {
  const newRoundsQuery = gql`
    {
      newRoundCreateds(
        first: 10
        skip: 0
        orderBy: roundId
        orderDirection: desc
        where: { groupAddress: "${groupAddress}" }
      ) {
        endAt
        groupAllocation
        roundId
        startAt
        target
      }
    }
  `;
  const roundInfoQuery = gql`
    {
      roundInfoChangeds(
        first: 50
        orderBy: blockTimestamp
        orderDirection: desc
        where: { groupAddress: "${groupAddress}" }
      ) {
        roundId
        roundImageUrl
        roundInfoUrl
        roundStory
        roundTitle
      }
    }
  `;
  const totalRaisedQuery = gql`
    {
      totalEthPledgedChangeds(
        first: 50
        orderBy: blockTimestamp
        orderDirection: desc
        where: { groupAddress: "${groupAddress}" }
      ) {
        roundId
        totalEthPledged
      }
    }
  `;

  Promise.all([
    request(configService.network.subgraphs.privateGroups, newRoundsQuery),
    request(configService.network.subgraphs.privateGroups, roundInfoQuery),
    request(configService.network.subgraphs.privateGroups, totalRaisedQuery),
  ]).then(data => {
    const rounds = data[0].newRoundCreateds;
    const roundInfo = data[1].roundInfoChangeds;
    const raisedAmounts = data[2].totalEthPledgedChangeds;

    privateRounds.value = [];
    isRoundStatusLoaded.value = [];

    rounds.forEach(roundBasics => {
      // Search groupInfo for groupId field with i value and return first one found
      const addInfo = roundInfo.find(
        item =>
          item.groupAddress === roundBasics.groupAddress &&
          item.roundId === roundBasics.roundId
      );
      let totalEthPledged = raisedAmounts.find(
        item =>
          item.groupAddress === roundBasics.groupAddress &&
          item.roundId === roundBasics.roundId
      );

      if (totalEthPledged) {
        totalEthPledged.totalEthPledged /= 1e18;
      } else {
        totalEthPledged = { roundId: roundBasics.roundId, totalEthPledged: 0 };
      }

      // Merge both dicts and populate the privateRounds ref
      privateRounds.value.push({
        ...roundBasics,
        ...addInfo,
        ...totalEthPledged,
      });

      isRoundStatusLoaded.value.push(true);
    });

    privateRounds.value.forEach(round => {
      round.target /= 1e18;
      round.groupAllocation /= 1e18;
      // round.totalEthPledged /= 1e18;
    });

    enrichRounds();

    isLoading.value = false;
  });
}

async function enrichRounds() {
  const tokensDepositedQuery = gql`
    {
      tokensDepositeds(
        first: 10
        orderBy: blockTimestamp
        orderDirection: asc
        where: { groupAddress: "${groupAddress}" }
      ) {
        roundId
        amount
      }
    }
  `;

  const rounds = await request(
    configService.network.subgraphs.privateGroups,
    tokensDepositedQuery
  );

  let isTokensDeposited = {} as RoundTokenInfo;

  privateRounds.value.forEach(round => {
    // round.target /= 1e18;
    // round.groupAllocation /= 1e18;
    // round.totalEthPledged /= 1e18;

    const currentDate = Math.round(Date.now() / 1e3);

    if (currentDate < round.startAt) {
      round.status = Status.NotStarted;
    } else if (currentDate > round.endAt) {
      if (round.totalEthPledged < round.target) {
        round.status = Status.Fail;
        return;
      }

      isTokensDeposited = rounds.tokensDepositeds.find(
        item => item.roundId === round.roundId
      );

      if (isTokensDeposited) {
        // If we're here tokens have been deposited, round ended
        round.status = Status.TokensClaimable;
      } else {
        round.status = Status.AwaitingTokens;
      }
    } else {
      round.status = Status.Ongoing;
      round.progress = Math.round(
        (round.totalEthPledged / round.groupAllocation) * 100
      );
    }
  });

  console.log();
}

function showPopup(_header: string, _roundId: number) {
  popupHeader.value = _header;
  roundId.value = _roundId;
  displayPopup.value = true;
}

async function functionWithArgs() {
  switch (popupHeader.value) {
    case 'Pledge':
      await contract.call('pledge', roundId.value, {
        value: ethers.utils.parseEther(amount.value.toString()),
      });
      displayPopup.value = false;
      break;
    case 'Unpledge':
      await contract.call(
        'unpledge',
        roundId,
        ethers.utils.parseEther(amount.value.toString())
      );
      displayPopup.value = false;
      break;
    case 'Deposit Tokens':
      depositTokens();
      displayPopup.value = false;
      break;
  }
}
async function depositTokens() {
  const tokenContract = await getContract(tokenAddress.value);

  const allowance = await tokenContract.erc20.allowance(groupAddress);

  const tokenAmount = bnum(amount.value).times(
    bnum(Math.pow(10, allowance.decimals))
  );

  if (tokenAmount > allowance.value) {
    await tokenContract.erc20.setAllowance(groupAddress, amount.value);
  }

  await contract.call(
    'depositTokens',
    roundId.value,
    tokenAddress.value,
    tokenAmount.toString()
  );

  const unsubscribe = contract.events.addEventListener(
    'TokensDeposited',
    event => {
      console.log(event.data.amount + 'tokens deposited successfully');
      enrichRounds();
      unsubscribe();
    }
  );
}
async function withdrawTotalEthPledged(roundId: number) {
  await contract.call('withdrawTotalEthPledged', roundId);

  const unsubscribe = contract.events.addEventListener(
    'TotalEthWithdrawn',
    event => {
      console.log(event.data.amount + 'tokens withdrawn successfully');
      unsubscribe();
    }
  );
}

async function refund(roundId: number) {
  await contract.call('refund', roundId);

  const unsubscribe = contract.events.addEventListener(
    'InvestorRefunded',
    event => {
      if (event.data.caller == account) {
        console.log(event.data.amount + 'tokens refunded successfully');
      }
      unsubscribe();
    }
  );
}
async function claimTokens(roundId: number) {
  await contract.call('claimTokens', roundId);

  const unsubscribe = contract.events.addEventListener(
    'InvestorClaimedTokens',
    event => {
      if (event.data.caller == account) {
        console.log(event.data.amount + 'tokens claimed successfully');
      }
      unsubscribe();
    }
  );
}
</script>

<template>
  <Dialog
    v-model:visible="displayPopup"
    :header="popupHeader"
    :style="{ width: '50vw' }"
  >
    <div v-if="popupHeader == 'Deposit Tokens'" class="flex-auto">
      <label for="address" class="block mb-2 font-bold"> Token Address </label>
      <InputText
        id="address"
        v-model="tokenAddress"
        type="text"
        placeholder="0x123.."
        minlength="42"
        maxlength="42"
        required
        style="width: 27rem"
      />
    </div>
    <div class="flex-auto mt-5">
      <label
        v-if="popupHeader == 'Deposit Tokens'"
        for="amount"
        class="block mb-2 font-bold"
      >
        Token Amount
      </label>
      <label v-else for="amount" class="block mb-2 font-bold">
        {{ nativeAssetSymbol }} Amount
      </label>
      <InputNumber v-model="amount" inputId="amount" required />
    </div>
    <template #footer>
      <div class="mt-8">
        <Button
          label="OK"
          severity="success"
          icon="pi pi-check"
          @click="functionWithArgs()"
        />
        <Button
          label="Cancel"
          severity="warning"
          icon="pi pi-times"
          @click="displayPopup = false"
        />
      </div>
    </template>
  </Dialog>
  <BalLoadingBlock v-if="isCheckingMembership" class="mt-16 h-96" />
  <span
    v-else-if="!isMember"
    class="flex justify-center items-center mt-10 mb-8 space-x-2.5 text-xl"
  >
    This address is not a member of this group.
  </span>
  <div v-else>
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
              v-if="isDefaultAdmin"
              class="absolute right-0 pr-10 space-x-2.5"
            >
              <BalBtn
                color="transparent-blue"
                size="sm"
                outline
                :class="{ 'mt-4': upToMediumBreakpoint }"
                @click="navigateToCreateRound"
              >
                {{ $t('createRound') }}
              </BalBtn>
              <BalBtn
                color="transparent-blue"
                size="sm"
                outline
                :class="{ 'mt-4': upToMediumBreakpoint }"
                @click="navigateToCreateRound"
              >
                {{ $t('manageMembers') }}
              </BalBtn>
            </div>
          </div>
        </div>
      </BalStack>
      <BalLoadingBlock v-if="isLoading" class="mt-16 h-96" />
      <div
        v-else
        class="flex flex-wrap gap-5 justify-center content-end items-stretch"
      >
        <div
          v-for="(round, index) in Object.entries(privateRounds)"
          :key="index"
        >
          <Card v-if="isRoundStatusLoaded[index]" class="card">
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
                v-else-if="round[1].status == Status.AwaitingTokens"
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
                v-else-if="round[1].status == Status.TokensClaimable"
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
              <img
                alt="Project image"
                class="max-h-32"
                :src="round[1].roundImageUrl"
              />
            </template>
            <template #title> {{ round[1].roundTitle }} </template>
            <template #subtitle>
              {{
                'Hard Cap: ' +
                formatAmount(round[1].groupAllocation) +
                ' ' +
                nativeAssetSymbol
              }}
            </template>
            <template #content>
              <p>
                {{ round[1].roundStory }}
              </p>
              <div v-if="round[1].status == Status.Ongoing" class="mt-5">
                {{
                  formatAmount(round[1].totalEthPledged) +
                  ' ' +
                  nativeAssetSymbol +
                  ' raised - ' +
                  getTimeLeft(round[1].endAt) +
                  ' left'
                }}
                <ProgressBar class="mt-5" :value="round[1].progress">
                </ProgressBar>
              </div>
              <!-- <InlineMessage
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
              </InlineMessage> -->
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
                {{ 'Starts in ' + getTimeLeft(round[1].startAt) }}
              </InlineMessage>
            </template>
            <template #footer>
              <div v-if="round[1].status == Status.Ongoing">
                <Button
                  icon="pi pi-arrow-circle-up"
                  label="Pledge"
                  @click="showPopup('Pledge', round[1].roundId)"
                />
                <Button
                  icon="pi pi-times"
                  label="Unpledge"
                  severity="secondary"
                  style="margin-left: 0.5em"
                  @click="showPopup('Unpledge', round[1].roundId)"
                />
              </div>
              <div
                v-else-if="
                  round[1].status == Status.AwaitingTokens && isDefaultAdmin
                "
                class="space-x-1"
              >
                <Button
                  icon="pi pi-arrow-circle-down"
                  :label="'Withdraw ' + nativeAssetSymbol"
                  @click="withdrawTotalEthPledged(round[1].roundId)"
                />
                <Button
                  icon="pi pi-arrow-circle-up"
                  label="Deposit tokens"
                  @click="showPopup('Deposit Tokens', round[1].roundId)"
                />
              </div>
              <div v-else-if="round[1].status == Status.TokensClaimable">
                <Button
                  icon="pi pi-arrow-circle-down"
                  label="Claim tokens"
                  @click="claimTokens(round[1].roundId)"
                />
              </div>
              <div v-else-if="round[1].status == Status.Fail">
                <Button
                  icon="pi pi-arrow-circle-down"
                  label="Get refund"
                  severity="secondary"
                  style="margin-left: 0.5em"
                  @click="refund(round[1].roundId)"
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