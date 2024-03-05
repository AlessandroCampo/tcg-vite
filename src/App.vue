<template>
  <img src="../src/assets/img/loading.gif" alt="" v-show="loading" id="loading_screen">
  <LoginScreen v-if="!generalStore.user"></LoginScreen>
  <!-- <GameMenu v-else></GameMenu> -->
  <router-view></router-view>


  <!-- <GameBattlefield v-else></GameBattlefield> -->
</template>

<script>
import GameBattlefield from './components/t1/GameBattlefield.vue';
import { useFirestore, useDocument } from 'vuefire'
import LoginScreen from './components/t1/LoginScreen.vue';
import GameMenu from './components/t1/GameMenu.vue';
import { useGeneralStore } from '../src/stores/generalStore'
import { auth } from '../src/firebase'
import { onAuthStateChanged } from "firebase/auth";
import { doc, collection, setDoc, onSnapshot } from 'firebase/firestore'
const db = useFirestore()

export default {
  data() {
    return {
      loading: true,
      generalStore: useGeneralStore()
    }
  },
  mounted() {
    // window.addEventListener('contextmenu', (e) => {
    //   e.preventDefault()
    // })
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.loading = false
        this.generalStore.user = user;
        this.generalStore.player.uid = user.uid


        const player_unsub = onSnapshot(doc(db, "Users", this.generalStore?.user.uid, 'GameState', 'GameState' + this.generalStore?.user.uid), (doc) => {
          this.generalStore.player = doc.data()
        });
        const playerInfo_unsub = onSnapshot(doc(db, "Users", this.generalStore?.user.uid), (doc) => {
          this.generalStore.playerInfo = doc.data()
        });

        await this.generalStore.updateDB()
        await this.generalStore.updatePlayerInfoDB()






      } else {
        this.loading = false
        console.log('no user')
        this.generalStore.user = null;
      }

    });
  },
  components: { GameBattlefield, LoginScreen, GameMenu }
}

</script>


<style scoped lang="scss">
#loading_screen {
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: 120;
}
</style>
