<script setup lang="ts">
import { provide, ref } from "vue";

interface Product {
  name: string
  type: string
  allergens: string[]

}

const props = defineProps<Product>()

const type = ref('');
provide('type', type);

</script>

<template>
  <div
      class="bg-gray-200 rounded-lg w-full flex justify-between items-center px-4 py-2 hover:translate-x-1 cursor-pointer transition font-[Karla] font-light"
      @click="">
    <div>
      {{ props.name }}
    </div>
    <div class="absolute left-7/15">
      {{ props.type }}
    </div>
    <div class="flex gap-2">
      <ul class="flex items-center gap-2">
        <li v-for="(allergen, index) in allergens" :key="index">
          <img :src="`/src/assets/icons/${allergen}.svg`" alt="icon"/>
        </li>
      </ul>
    </div>
  </div>
</template>