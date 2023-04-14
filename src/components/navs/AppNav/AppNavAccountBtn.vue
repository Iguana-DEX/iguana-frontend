<script setup lang="ts">
import useBreakpoints from '@/composables/useBreakpoints';
import useWeb3 from '@/services/web3/useWeb3';
import { shorten } from '@/lib/utils';

import AppNavSettings from './AppNavSettings.vue';

const { upToLargeBreakpoint, isMobile } = useBreakpoints();
const { isLoadingProfile, profile, account } = useWeb3();
</script>

<template>
  <BalPopover
    noPad
    :align="isMobile ? 'center' : undefined"
    :detached="isMobile ? true : undefined"
  >
    <template #activator>
      <BalBtn
        class="text-base"
        :class="{ btn: upToLargeBreakpoint }"
        :loading="isLoadingProfile"
        :loadingLabel="upToLargeBreakpoint ? '' : shorten(account)"
        color="white"
        :size="upToLargeBreakpoint ? 'md' : 'sm'"
        :circle="upToLargeBreakpoint"
      >
        <div
          style="
            overflow: hidden;
            width: 20px;
            height: 20px;
            border-radius: 10px;
          "
        >
          <svg width="20px" height="20px">
            <rect
              x="0"
              y="0"
              width="20"
              height="20"
              fill="#C71458"
              transform="translate(0.4745351168132376 0.370902271294623) rotate(149.6 10 10)"
            ></rect>
            <rect
              x="0"
              y="0"
              width="20"
              height="20"
              fill="#F72F01"
              transform="translate(-9.334768481386906 -0.8541736672106323) rotate(291.9 10 10)"
            ></rect>
            <rect
              x="0"
              y="0"
              width="20"
              height="20"
              fill="#018C87"
              transform="translate(2.5986292053074935 -14.38727262779078) rotate(367.7 10 10)"
            ></rect>
          </svg>
        </div>
        <span
          v-if="profile"
          class="hidden lg:inline-block pl-2"
          v-text="profile && profile"
        />
        <span
          v-else
          class="hidden lg:inline-block pl-2 eth-address"
          v-text="shorten(account)"
        />
      </BalBtn>
    </template>
    <AppNavSettings />
  </BalPopover>
</template>


