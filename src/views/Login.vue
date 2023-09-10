<script setup lang="ts">
import { ref } from 'vue';
import { login as serverLogin } from '../services/auth'
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');

const router = useRouter();

function login() {
    serverLogin(username.value, password.value)
        .then(() => {
            router.push({ name: 'dir' });
        })
        .catch((error) => {
            console.log(error);
        });
}
</script>

<template>
    <input v-model="username" placeholder="Username">
    <input v-model="password" type="password" placeholder="Password">
    <button @click="login">Login</button>
</template>

<style>
</style>

