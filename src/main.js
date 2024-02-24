
import './style.scss'
import { createApp } from 'vue'
import { VueFire, VueFireAuth, VueFireFirestoreOptionsAPI, VueFireDatabaseOptionsAPI } from 'vuefire'
import { createPinia } from 'pinia'
import { firebaseApp } from './firebase'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

app.use(VueFire, {
    // imported above but could also just be created here
    firebaseApp,
    modules: [
        // we will see other modules later on
        VueFireAuth(),
        VueFireFirestoreOptionsAPI({
            // this would be the same behavior as VueFire v2
            reset: true,
            wait: false,
        }),
        VueFireDatabaseOptionsAPI({
            // this would be the same behavior as VueFire v2
            reset: true,
            wait: false,
        }),
    ],
})

app.mount('#app')