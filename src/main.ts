import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/Router.ts";
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

const app = createApp(App)
app.use(autoAnimatePlugin)
app.use(router)
app.mount('#app')
