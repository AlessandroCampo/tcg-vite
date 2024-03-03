<template>
    <div class="login-container">
        <div class="login-left">
            <!-- <form @submit.prevent="login">
                <div class="title text-3xl">Login</div>
                <input placeholder="Email" type="mail" v-model="loginData.mail" />
                <br />
                <input placeholder="Password" type="password" v-model="loginData.pass" />
                <br />
                <button type="submit" class="text-3xl">Login</button>
                <p class="text-slate-400 text-xl cursor-pointer" @click="logSign"> (Create a new account)</p>
            </form> -->

            <form @submit.prevent="signUp" class="sign-up">
                <div class="title">Sign Up</div>
                <div class="form-fields">
                    <input class="input" placeholder="Username" type="text" v-model="newAccData.username" />
                    <br />
                    <input placeholder="Password" type="password" v-model="newAccData.pass" />
                    <br />
                    <input placeholder="email" type="email" v-model="newAccData.mail" />
                    <br />
                </div>

                <!-- <input type="file" @change="onChangeFileUpload($event)" /> -->
                <button type="submit">Sign Up</button>
                <!-- <p class="text-slate-400 text-xl cursor-pointer" @click="logSign">(Have an account already?)</p> -->
            </form>
        </div>
        <div class="login-right">

        </div>
    </div>
</template>

<script>
import { auth } from '../../firebase'
import { useFirestore, useDocument } from 'vuefire'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useGeneralStore } from '../../stores/generalStore'
import { doc, collection, setDoc } from 'firebase/firestore'
import { setTransitionHooks } from 'vue';
const db = useFirestore()


// import { auth } from "./firebase";


export default {
    data() {
        return {
            loginData: {
                mail: '',
                pass: '',
                generalStore: useGeneralStore()
            },
            newAccData: {
                username: '',
                mail: '',
                pass: ''
            },
            generalStore: useGeneralStore()
        }
    },
    methods: {
        async login() {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, this.loginData.mail, this.loginData.pass);
                const user = userCredential.user;
                this.generalStore.user = user
            } catch (error) {
                console.error("Error signing in:", error.message);
                window.alert("I dati inseriti non sono corretti")
            }
        },
        async signUp() {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, this.newAccData.mail, this.newAccData.pass);
                const user = userCredential.user;
                this.generalStore.player.username = this.newAccData.username
                console.log(this.generalStore.player.username)

                await setDoc(doc(db, "Users", user.uid), {
                    username: this.newAccData.username,
                    password: this.newAccData.pass,
                    email: this.newAccData.mail,
                    uid: user.uid,
                });

                console.log("User successfully signed up!");
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    window.alert('Email is already in use.')
                } else {
                    console.error('Error signing up user:', error.message);
                    window.alert('Error signing up user:', error.message);
                }
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.login-container {
    width: 100vw;
    height: 100vh;
    background-image: url('../../assets/img/menu_background.png');
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;

    .sign-up {
        background-color: rgba($color: #444, $alpha: 0.7);
        padding: 30px;
        border-radius: 30%;
        font-size: 2em;
        display: flex;
        flex-direction: column;
        gap: 30px;
        font-weight: bold;
        align-items: center;
        text-transform: uppercase;

        input {
            font-size: 0.6em;
            padding: 5px;
        }

        button {
            font-size: 0.5em;
            border-radius: 30px;
            padding-inline: 20px;
            padding-block: 8px;
            color: white;
            background-color: slategrey;
            border: 2px solid white;
            cursor: pointer;
        }
    }

}
</style>