
<template>
  <LoginScreen v-if="!generalStore.user"></LoginScreen>
  <GameBattlefield v-else></GameBattlefield>
</template>

<script 
>
import GameBattlefield from './components/t1/GameBattlefield.vue';
import { useFirestore, useDocument } from 'vuefire'
import LoginScreen from './components/t1/LoginScreen.vue';
import { useGeneralStore } from '../src/stores/generalStore'
import { auth } from '../src/firebase'
import { onAuthStateChanged } from "firebase/auth";
import { doc, collection, setDoc, onSnapshot } from 'firebase/firestore'
const db = useFirestore()

export default {
  data() {
    return {
      generalStore: useGeneralStore()
    }
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.generalStore.user = user;
        this.generalStore.player.uid = user.uid
        await this.generalStore.updateDB()

        const player_unsub = onSnapshot(doc(db, "Users", this.generalStore?.user.uid), (doc) => {
          this.generalStore.player = doc.data()
        });

        const oppo_unsub = onSnapshot(doc(db, "Users", this.generalStore?.opponentUid), (doc) => {
          this.generalStore.opponent = doc.data()
        });


      } else {
        console.log('no user')
        this.generalStore.user = null;
      }

    });
  },
  components: { GameBattlefield, LoginScreen }
}

</script>


<style scoped lang="scss"></style>
