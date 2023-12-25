import 'virtual:uno.css'
import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import VueGtag from 'vue-gtag'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import UndrawUi from 'undraw-ui'
import App from './App.vue'
import router from './router'
import NPlayer from './plugins/NPlayer'
import 'undraw-ui/dist/style.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia).use(router).use(NPlayer).use(UndrawUi).use(VueGtag, {
  config: { id: 'G-7DWSQ58M55' },
}, router)

app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
