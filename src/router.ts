import { createRouter, createWebHistory } from 'vue-router'

import Home from './components/Home.vue'
import MomentApp from './components/MomentApp.vue'
import HydraulicGropuer from './components/HydraulicGropue.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/moment', name: 'MomentApp', component: MomentApp },
  { path: '/hydraulic', name: 'HydraulicGropue', component: HydraulicGropuer },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 