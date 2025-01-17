import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import { isGoerli } from '@/composables/useNetwork';
import { applyNavGuards } from './nav-guards';

const ClaimPage = () =>
  import(/* webpackChunkName: "ClaimPage" */ '@/pages/claim/index.vue');
const LegacyClaimPage = () =>
  import(/* webpackChunkName: "LegacyClaimPage" */ '@/pages/claim/legacy.vue');
const CookiesPolicyPage = () =>
  import(
    /* webpackChunkName: "CookiesPolicyPage" */ '@/pages/cookies-policy.vue'
  );
const GetVeBalPage = () =>
  import(/* webpackChunkName: "GetVeBalPage" */ '@/pages/get-vebal.vue');
const HomePage = () =>
  import(
    /* webpackChunkName: "HomePage" */ /* webpackPrefetch: true */ '@/pages/index.vue'
  );
const PoolsPage = () =>
  import(
    /* webpackChunkName: "PoolsPage" */ /* webpackPrefetch: true */ '@/pages/pool.vue'
  );
const PoolPage = () =>
  import(
    /* webpackChunkName: "PoolPage" */ /* webpackPrefetch: true */ '@/pages/pool/_id.vue'
  );
const CreatePoolPage = () =>
  import(/* webpackChunkName: "CreatePoolPage" */ '@/pages/pool/create.vue');
const PoolInvestPage = () =>
  import(/* webpackChunkName: "PoolInvestPage" */ '@/pages/pool/invest.vue');
const MigratePoolPage = () =>
  import(/* webpackChunkName: "MigratePoolPage" */ '@/pages/pool/migrate.vue');
const PoolWithdrawPage = () =>
  import(
    /* webpackChunkName: "PoolWithdrawPage" */ '@/pages/pool/withdraw.vue'
  );
const PrivacyPolicyPage = () =>
  import(
    /* webpackChunkName: "PrivacyPolicyPage" */ '@/pages/privacy-policy.vue'
  );
const TermsOfUsePage = () =>
  import(/* webpackChunkName: "TermsOfUsePage" */ '@/pages/terms-of-use.vue');
const TradePage = () =>
  import(
    /* webpackChunkName: "TradePage" */ /* webpackPrefetch: true */ '@/pages/trade.vue'
  );
const UnlockVeBalPage = () =>
  import(/* webpackChunkName: "UnlockVeBalPage" */ '@/pages/unlock-vebal.vue');
const VeBalPage = () =>
  import(/* webpackChunkName: "VeBalPage" */ '@/pages/dao.vue');
const FaucetPage = () =>
  import(/* webpackChunkName: "FaucetPage" */ '@/pages/faucet.vue');

const PortfolioPage = () =>
  import(
    /* webpackChunkName: "PortfolioPage" */ /* webpackPrefetch: true */ '@/pages/portfolio.vue'
  );
const PrivateGroupsPage = () =>
  import(
    /* webpackChunkName: "PrivateGroupsPage" */ '@/pages/private-groups.vue'
  );
const CreateGroupPage = () =>
  import(
    /* webpackChunkName: "CreateGroupPage" */ '@/pages/private-groups/create-group.vue'
  );
const PrivateRoundsPage = () =>
  import(
    /* webpackChunkName: "PrivateRoundsPage" */ '@/pages/private-groups/_groupAddress.vue'
  );
const CreateRoundPage = () =>
  import(
    /* webpackChunkName: "CreateRoundPage" */ '@/pages/private-groups/create-round.vue'
  );

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string;
    bgColors?: {
      dark: string;
      light: string;
    };
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/terms-of-use',
    name: 'terms-of-use',
    component: TermsOfUsePage,
    meta: { layout: 'ContentLayout' },
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: PrivacyPolicyPage,
    meta: { layout: 'ContentLayout' },
  },
  {
    path: '/cookies-policy',
    name: 'cookies-policy',
    component: CookiesPolicyPage,
    meta: { layout: 'ContentLayout' },
  },
  {
    path: '/:networkSlug/pool',
    name: 'pools',
    component: PoolsPage,
  },
  {
    path: '/:networkSlug/trade/:assetIn?/:assetOut?',
    name: 'trade',
    component: TradePage,
  },
  {
    path: '/:networkSlug/swap/:assetIn?/:assetOut?',
    redirect: to => {
      return `/trade${to.path.split('/swap')[1]}`;
    },
  },
  {
    path: '/:networkSlug/pool/create/:tx?',
    name: 'create-pool',
    component: CreatePoolPage,
    meta: { layout: 'FocusedLayout' },
  },
  {
    path: '/:networkSlug/pool/:id',
    name: 'pool',
    component: PoolPage,
  },
  {
    path: '/:networkSlug/pool/:id/invest',
    name: 'invest',
    component: PoolInvestPage,
    meta: { layout: 'FocusedLayout' },
  },
  {
    path: '/:networkSlug/pool/:id/withdraw',
    name: 'withdraw',
    component: PoolWithdrawPage,
    meta: { layout: 'FocusedLayout' },
  },
  {
    path: '/:networkSlug/pool/migrate/:from/:to',
    name: 'migrate-pool',
    component: MigratePoolPage,
    meta: { layout: 'FocusedLayout' },
  },
  {
    path: '/:networkSlug/dao',
    name: 'vebal',
    component: VeBalPage,
  },
  {
    path: '/:networkSlug/get-vebal',
    name: 'get-vebal',
    component: GetVeBalPage,
    meta: { layout: 'FocusedLayout' },
  },
  {
    path: '/:networkSlug/unlock',
    name: 'unlock',
    component: UnlockVeBalPage,
    meta: { layout: 'FocusedLayout' },
  },
  {
    path: '/:networkSlug/claim',
    name: 'claim',
    component: ClaimPage,
  },
  {
    path: '/:networkSlug/claim/legacy',
    name: 'legacy-claim',
    component: LegacyClaimPage,
  },
  {
    path: '/:networkSlug/portfolio',
    name: 'portfolio',
    component: PortfolioPage,
  },
  {
    path: '/:networkSlug?',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/:networkSlug/private-groups',
    name: 'private-groups',
    component: PrivateGroupsPage,
  },
  {
    path: '/:networkSlug/private-groups/create-group',
    name: 'create-group',
    component: CreateGroupPage,
    meta: { layout: 'FocusedLayout' },
  },
  {
    path: '/:networkSlug/private-groups/:groupAddress',
    name: 'private-rounds',
    component: PrivateRoundsPage,
  },
  {
    path: '/:networkSlug/private-groups/:groupAddress/create-round',
    name: 'create-round',
    component: CreateRoundPage,
    meta: { layout: 'FocusedLayout' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
];

/**
 * TESTNET ONLY ROUTES
 */
if (isGoerli.value) {
  routes.push({
    path: '/:networkSlug/faucet',
    name: 'faucet',
    component: FaucetPage,
  });
}

/**
 * DEV/STAGING ONLY ROUTES
 */
// if (
//   ['development', 'staging'].includes(import.meta.env.VITE_ENV || 'development')
// ) {
//   routes.push();
// }

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default applyNavGuards(router);
