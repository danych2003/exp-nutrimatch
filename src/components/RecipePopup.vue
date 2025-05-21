<script setup lang="ts">

import type {Recipe} from "@/model/Recipe.ts";
import type {ProductFull} from "@/model/ProductFull.ts";
import {getCookie} from "@/utils/LoginHelper.ts";
import axios from "axios";
import {onMounted, ref, watch} from "vue";
import type {ProductRecipe} from "@/model/ProductRecipe.ts";

interface RecipePopup {
  recipe: Recipe
  calories: number
}

const props = defineProps<RecipePopup>()

const productsProp = ref<ProductFull[]>()

const emit = defineEmits(['popupCloseEvent'])

function closePopup() {
  emit('popupCloseEvent', 'closed')
}

const fetchProducts = async () => {
  const token = getCookie("token");
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const params = {
      ids: props.recipe.products.map(product => product.productId).join(',')
    }

    const response = await axios.get(`http://localhost:8443/api/products`,
        {
          params,
          headers,
        });

    productsProp.value = response.data.map((productRaw: ProductFull) => productRaw);
    console.log(productsProp.value);
  } catch (e) {
    console.error(e);
  }
}
const getProductName = (names: ProductFull['productNames']) => {
  const name = names.find(n => n.language === 'et') || names[0]
  return name?.name || 'No name'
}

const getProductQuantity = (id: number): number => {
  const product = props.recipe.products.find(p => p.productId === id);
  return product?.quantity ?? 0;
};

fetchProducts()
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="w-[1000px] bg-white p-5 rounded-xl">
      <div class="flex m-lg-auto justify-end">
        <img @click="closePopup"
             class="cursor-pointer"
             src="../assets/icons/cross.svg" alt="cross">
      </div>
      <div class="block">
        <h1 class="text-3xl font-bold">{{ recipe.title }}</h1>

        <div v-if="recipe.photoBase64" class="mt-4">
          <img
              :src="recipe.photoBase64"
              alt="Recipe Image"
              class="w-full max-w-md rounded-xl border"
          />
        </div>

        <div>
          <h2 class="text-xl font-semibold mt-6 mb-2">Description</h2>
          <p class="text-gray-700">{{ recipe.description }}</p>
        </div>

        <div>
          <h2 class="text-xl font-semibold mt-6 mb-2">Ingredients</h2>
          <div
              v-for="product in productsProp"
              :key="product.id"
              class="bg-gray-100 rounded-lg px-4 py-2 mb-2 flex justify-between"
          >
            <span>{{ getProductName(product.productNames) }} </span>
            <span>{{ getProductQuantity(product.id) }} grams</span>
          </div>
        </div>

        <div class="text-right font-medium">
          🔥 Calories:
            {{ props.calories }}
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>