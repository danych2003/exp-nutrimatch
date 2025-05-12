import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/Router.ts";
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(autoAnimatePlugin)
app.use(router)
app.use(pinia)
app.mount('#app')
