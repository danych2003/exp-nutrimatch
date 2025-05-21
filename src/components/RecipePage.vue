<script setup lang="ts">
import {ref} from "vue";
import {getCookie} from "@/utils/LoginHelper.ts";
import axios from "axios";
import type {ProductFull} from "@/model/ProductFull.ts";

interface RecipePage {
  name: string,
  img: string,
  calories: number,
  allergens: string[]
}

const props = defineProps<RecipePage>()

const emit = defineEmits(['popupOpenEvent'])

function handleClick() {
  emit('popupOpenEvent', 'popup-clicked', )
}
</script>

<template>
  <div class="relative bg-white border border-slate-100 rounded-xl p-5 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl w-75"
  @click="handleClick">
    <img :src="props.img" alt="recipe" class="w-full rounded-3xl "/>
    <p class="mt-3 font-[Karla] font-bold">{{props.name}}</p>
    <p class="mt-3 font-[Karla] font-bold">{{props.calories}} 🔥</p>
    <div class="flex justify-between mt-2">
      <div class="flex flex-col gap-2">
        <span class="text-slate-400 font-[Karla]">Allergens</span>
        <ul class="flex items-center gap-2">
          <li v-for="(allergen, index) in allergens" :key="index">
            <img :src="`/src/assets/icons/${allergen}.svg`" alt="icon"/>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>