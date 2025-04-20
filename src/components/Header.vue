<script setup lang="ts">

import {getCookie} from "@/utils/LoginHelper.ts";
import router, {changeAppScreenState} from "@/router/Router.ts";

function logout(): void {
  deleteCookie("token");
  changeAppToLogin()
}

function changeAppToLogin() {
  router.replace("/login");
}

function deleteCookie(cname: string) {
  document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
</script>

<template>
  <div class="flex justify-between border-b border-b-gray-300 px-8 p-19 pb-9">

    <div class="flex items-center">
      <img src="../assets/logo.svg" class="w-12 mr-5" alt="logo">
      <div>
        <h2 class="font-[Jua] text-3xl">NutriMatch</h2>
        <p class="font-[Karla] font-extralight text-xl text-gray-400">Your food mate and assistant</p>
      </div>
    </div>

    <ul class="flex items-center gap-10 font-[Jua] text-gray-400">
      <li @click="changeAppScreenState('recipes')" class="flex gap-3 hover:text-black cursor-pointer">
        <img src="../assets/icons/recipes-icon.svg" alt="icon">
        Recipes
      </li>
      <li @click="changeAppScreenState('products')" class="flex gap-3 hover:text-black cursor-pointer">
        <img src="../assets/icons/products-icon.svg" alt="icon">
        Products
      </li>
      <li @click="changeAppScreenState('profile')" class="flex gap-3 hover:text-black cursor-pointer">
        <img src="../assets/icons/profile-icon.svg" alt="icon">
        Profile
      </li>
      <li @click="logout" class="flex gap-3 hover:text-black cursor-pointer">
        <img src="../assets/icons/logout.svg" alt="icon">
        Logout
      </li>
    </ul>
  </div>
</template>