
import './style.scss'
import { createApp } from 'vue'
import { VueFire, VueFireAuth, VueFireFirestoreOptionsAPI, VueFireDatabaseOptionsAPI } from 'vuefire'
import { createPinia } from 'pinia'
import { firebaseApp } from './firebase'
import { createRouter, createWebHashHistory } from 'vue-router';
import GameMenu from './components/t1/GameMenu.vue'
import GameBattlefield from './components/t1/GameBattlefield.vue'
import GameCollection from './components/t1/GameCollection.vue'
import GameShop from './components/t1/GameShop.vue'
import App from './App.vue'
import { useGeneralStore } from "../src/stores/generalStore";

const pinia = createPinia()

const routes = [
    { path: '/', component: GameMenu },
    {
        path: '/battle',
        component: GameBattlefield,
        beforeEnter: (to, from, next) => {
            if (useGeneralStore().$state.battlePageFlag) {
                next();
            } else {
                next('/');
            }
        }
    },
    {
        path: '/collection',
        component: GameCollection,
        beforeEnter: (to, from, next) => {
            if (useGeneralStore().$state.collectionPageFlag) {
                next();
            } else {
                next('/');
            }
        }
    },
    {
        path: '/shop',
        component: GameShop,
        beforeEnter: (to, from, next) => {
            if (useGeneralStore().$state.shopPageFlag) {
                next();
            } else {
                next('/');
            }
        }
    }

]



const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const app = createApp(App)



app.use(pinia)

app.use(VueFire, {
    firebaseApp,
    modules: [
        VueFireAuth(),
        VueFireFirestoreOptionsAPI({
            reset: true,
            wait: false,
        }),
        VueFireDatabaseOptionsAPI({
            reset: true,
            wait: false,
        }),
    ],
})

app.use(router)
app.mount('#app')
export { app }