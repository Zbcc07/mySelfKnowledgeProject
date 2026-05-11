import { createApp } from 'vue'
import 'highlight.js/styles/atom-one-dark.css'
import './style.css'
import './styles/global.scss'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
