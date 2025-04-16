<template>
  <header class="flex justify-between border-b border-b-gray-300 px-8 p-19 pb-9">

    <div class="flex items-center">
      <img src="../assets/logo.svg" class="w-12 mr-5" alt="logo">
      <div>
        <h2 class="font-[Jua] text-3xl">NutriMatch</h2>
        <p class="font-[Karla] font-extralight text-xl text-gray-400">Your food mate and assistant</p>
      </div>
    </div>

    <ul class="flex items-center gap-10 font-[Jua] text-gray-400">
      <li class="flex gap-3 hover:text-black cursor-pointer">
        <img src="../assets/icons/recipes-icon.svg" alt="icon">
        Recipes
      </li>
      <li class="flex gap-3 hover:text-black cursor-pointer">
        <img src="../assets/icons/products-icon.svg" alt="icon">
        Products
      </li>
      <li class="flex gap-3 hover:text-black cursor-pointer">
        <img src="../assets/icons/profile-icon.svg" alt="icon">
        Profile
      </li>
    </ul>
  </header>
</template>