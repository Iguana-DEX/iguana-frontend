import '@/assets/css/tailwind.css';
import '@/assets/css/index.css';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';

import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import registerDirectives from '@/plugins/directives';
import { registerPlugins } from '@/plugins';
import initSentry from '@/plugins/sentry';
import Jazzicon from 'vue3-jazzicon/src/components';

import Root from './Root.vue';

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/viva-dark/theme.css'; // PrimeVue Theme
import 'primevue/resources/primevue.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Icons
import Tooltip from 'primevue/tooltip';

echarts.use([
  TooltipComponent,
  CanvasRenderer,
  LineChart,
  GridComponent,
  LegendComponent,
  BarChart,
  PieChart,
]);

const app = createApp(Root);

app.component('Jazzicon', Jazzicon);

// Pinia
app.use(createPinia());

// PrimeVue
app.use(PrimeVue, { ripple: true });
app.directive('tooltip', Tooltip);

registerPlugins(app);
registerDirectives(app);
initSentry(app);

app.mount('#app');

export default app;
