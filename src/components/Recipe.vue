<script setup lang="ts">
import {ref} from "vue";

interface Recipe {
  name: string;
  img: string
}

const props = defineProps<Recipe>()
</script>

<template>
  <div class="relative bg-white border border-slate-100 rounded-xl p-5 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl w-75">
    <img :src="props.img" alt="recipe" class="w-full rounded-3xl "/>
    <p class="mt-3 font-[Karla] font-bold">{{props.name}}</p>
    <div class="flex justify-between mt-2">
      <div class="flex flex-col gap-2">
        <span class="text-slate-400 font-[Karla]">Allergens</span>
        <img src="../assets/icons/fish.svg" alt="search" class="w-8 rounded-3xl"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>