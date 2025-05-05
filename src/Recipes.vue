<script setup lang="ts">


import ProductList from "@/components/ProductList.vue";
import Header from "@/components/Header.vue";
import ProductPopup from "@/components/ProductPopup.vue";
import Recipe from "@/components/Recipe.vue";
</script>

<template>
  <div class="w-9/10 bg-white m-auto rounded-3xl shadow-2xl mt-5">
    <Header/>
    <div class="p-5">
      <div class="pb-5">
          <div class="flex justify-between items-center">
            <h2 class="font-[Karla] font-extrabold text-3xl">Recipes</h2>
            <div class="relative">
              <img @click="" class="absolute left-3 top-3 cursor-pointer"
                   src="../src/assets/icons/zoom.svg" alt="zoom">
              <input
                  @keyup.enter=""
                  class="font-[Karla] font-light border border-gray-300 hover:border-gray-500 rounded-md py-2 pl-10 pr-4 outline-none"
                  type="text"
                  placeholder="Search..."
                  autocomplete="off">
            </div>
          </div>
      </div>

      <div class="grid grid-cols-5 gap-10 column-gap">
        <Recipe
            :name="'Tika masala'"
            :img="'../src/assets/icons/recipes/tika.jpg'"
        />
        <Recipe
            :name="'Bolognese'"
            :img="'../src/assets/icons/recipes/bolognese.jpg'"
        />
        <Recipe
            :name="'Bolognese'"
            :img="'../src/assets/icons/recipes/bolognese.jpg'"
        />
        <Recipe
            :name="'Bolognese'"
            :img="'../src/assets/icons/recipes/bolognese.jpg'"
        />
        <Recipe
            :name="'Bolognese'"
            :img="'../src/assets/icons/recipes/bolognese.jpg'"
        />
        <Recipe
            :name="'Tika masala'"
            :img="'../src/assets/icons/recipes/tika.jpg'"
        />
        <Recipe
            :name="'Tika masala'"
            :img="'../src/assets/icons/recipes/tika.jpg'"
        />
      </div>

    </div>
  </div>
</template>