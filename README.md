# 🦎 IguanaDEX Frontend

<p align="center">
  <img width="320" height="246" src="https://user-images.githubusercontent.com/34973295/206001164-103361a4-086e-4e12-83e6-8a2d7ccd4d59.png">
</p>

## Development

This project will ONLY work properly if you use Node.js version 16.x (Gallium LTS) and NPM version 8+.

To setup the development environment first clone the repo:

```bash
git clone https://github.com/iguana-dex/iguana-frontend.git && cd iguana-frontend
```

### Local env

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run dev
```

The app should now be live at [http://localhost:8080](http://localhost:8080)

### Testing

Run unit tests:

```bash
npm run test:unit
```

Run unit tests in watch mode:

```bash
npm run test:unit:watch
```

Run unit tests with coverage:

```bash
npm run test:unit:coverage
```

### Build

Run build:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

Run build in watch mode:

```bash
npm run build:watch
```

This mode is useful when you need to reproduce/fix bugs/issues in a **production-like** environment.

## Vite setup

This app is powered by [vite](https://vitejs.dev/), which:

- Runs a development dev server with [esbuild](https://esbuild.github.io/).
- Builds production bundle with [Rollup](https://rollupjs.org/guide/en/).

Both tools above rely on native ES modules but our app also depends on libraries like [ethers.js](https://docs.ethers.io/) which use Node.js built-in modules (like Buffer, stream or crypto) that require browser polyfills. This is why our `vite.config.ts` uses `node-pollyfills` and [rollup-plugin-polyfill-node](https://www.npmjs.com/package/rollup-plugin-polyfill-node).

### unplugin-vue magic 🪄

We use some Vite plugins to improve the Vue developer experience.

[unplugin-vue-components](https://github.com/antfu/unplugin-vue-components):

Auto imports components located in `src/components/_global` so that they are available from every other component in the application (and from _vitest_).
(It also auto generates a _d.ts_ file for the auto imported components).

### Analyze bundle

Analyze and visualize the bundle dependencies by adding these env vars to your `.env` file before running the build:

```bash
# Local .env file
VITE_BUILD_ANALIZE=true
VITE_BUILD_VISUALIZE=true
```

# 📚 &nbsp;General Info

<br />

This repository contains the main features of [iguanadex.com](https://iguanadex.com):<br />
[A) Home tab/landing page](https://github.com/Iguana-DEX/iguana-frontend#a-home-tab--landing-page) <br />
[B) Swaps tab](https://github.com/Iguana-DEX/iguana-frontend#b-swaps-tab) <br />
[C) DMI Pool tab](https://github.com/Iguana-DEX/iguana-frontend#c-dmi-pool-tab) <br />
[D) DMI Borrow Market tab](https://github.com/Iguana-DEX/iguana-frontend#d-dmi-borrow-market-tab) <br />
[E) DMI Perpetual Swaps tab](https://github.com/Iguana-DEX/iguana-frontend#e-dmi-perpetual-swaps-tab) <br />
[F) DAO tab](https://github.com/Iguana-DEX/iguana-frontend#f-dao-tab) <br />

The overall website is jungle-themed. Numerous animations are used to make it livelier, some of which are triggered by user interactions.
On the sides of the page, there is a forest background with falling leaves. The leaves of the trees move when the pointer hovers over them.
There are also iguanas sporadically showing up and sticking out their long curly red tongues.

```diff
Color Palette:
+ Green for the main color
- Red undertones
```

## A) Home tab & landing page:

The landing page displays the latest information about the Digital Market Index - the bedrock of the products offered by Iguana.

There is also a "Time Machine" tab providing a wealth of information and charts regarding index changes, the index's performance and its components since January 2018.

This is meant as information, something that users refer to quite often. Iguana uses it to promote the trading part of the DApp along with the option to _buy the DMI token off-chain_.

## B) Pool tab:

Here investors can deposit to the **main DMI pool** - which is a SMM ("Smart Automated Market-Maker) with weights set to match the Digital Market Index. Note that the Digital Market Index's weights change at 12am UTC on the 1st of each month.

## C) Trade tab:

### a) Spot trading:

Here traders are able to swap a coin for another directly on-chain as long as both the token they're selling and the one they're buying are part of the 11 coins in the DMI pool (top 10 coins by real market cap + USDT)

The swap fee differs depending on the pair you are trading.
This swap fee is collected in the token being sold, e.g. if a trader is swapping 1 BTC for ETH (swap fee 0.05%), then 0.0005 BTC will be collected as swap fees.

### b) Perpetual swap trading:

Leveraged traders and hedgers can go long or short the Digital Market Index with up to 50x leverage in a cost-effective way and in decent size.
The trading of those perpetual swaps is underpinned by an auction mechanism occuring twice a day, at 9am UTC and 9pm UTC.

This process is similar to Nasdaq's [Opening Cross](https://www.investopedia.com/terms/o/opening-cross.asp).
30 minutes before the auction, iggies can place limit buy and limit sell orders for DMI perpetual swaps.

## D) DMI Borrow Market tab:

Here traders and arbitragers can either provide DMI tokens and borrow some USDT against them or vice-versa. The interest rate on the DMI and/or USDT borrowed is based on a utilisation curve. This market will be based on Aave v3's isolated markets implementation (?).

It is important that arbitragers are able to borrow DMI tokens so that they can _short-sell_ spot DMI tokens and buy perpetual swaps against them in cases where the perpetual swap trades lower than the spot DMI token. This will be incentivised by a classic funding mechanism in addition to the opportunity to capture small price differentials - more on this in **4.**

## E) Portfolio tab:

Monitor your entire crypto portfolio in one place. Here you can view your positions on all EVM chains along with spot and future positions on the Binance and Bybit centralized exchanges.

## F) DAO tab:

Can buy or sell IGN tokens here. IGN is the native token of Iguana - IGN holders collect 100% of the revenues of Iguana.
IGN holders can also vote on various proposals directly on this tab (thanks to snapshot.org's API).
Minimal information about the breakdown of revenues and usage of the protocol are also available here?
