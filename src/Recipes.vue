<script setup lang="ts">


import Header from "@/components/Header.vue";
import {getPageRange} from "@/utils/PageHelper.ts";
import {onMounted, reactive, ref, watch} from "vue";
import {getCookie} from "@/utils/LoginHelper.ts";
import axios from "axios";
import type {ProductFull} from "@/model/ProductFull.ts";
import {getProductView} from "@/utils/ProductMapper.ts";
import type {Recipe} from "@/model/Recipe.ts";
import RecipePage from "@/components/RecipePage.vue";
import type {ProductRecipe} from "@/model/ProductRecipe.ts";
import RecipePopup from "@/components/RecipePopup.vue";
import type {ViewProduct} from "@/model/ViewProduct.ts";

const availablePageNumber = ref(0)
const recipes = ref<Recipe[]>([]);
const filters = reactive({
  sortBy: '',
  searchQuery: '',
  currentPage: 1,
})
const popupState = ref(false);
const productsViewProp = ref<ViewProduct[]>([]);
const productsFullProp = ref<ProductFull[]>([]);
const selectedRecipe = ref<Recipe | null>(null);
const recipeAllergensMap = ref<Map<string, string[]>>(new Map());
const recipeEnergyMap = ref<Map<string, number>>(new Map());

const fetchItems = async () => {
  const token = getCookie("token");
  try {
    const params = {
      search_query: filters.searchQuery,
      current_page: filters.currentPage - 1,
    };
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/recipes`,
        {
          params,
          headers,
        });

    const availablePages = response.headers["x-available-pages"];
    if (availablePages) {
      availablePageNumber.value = parseInt(availablePages);
    } else {
      console.warn("X-Available-Pages header is missing");
    }

    recipes.value = response.data;

    for (const recipe of recipes.value) {
      await fetchProducts(recipe);
      const products: ViewProduct[] = productsViewProp.value;
      const allergens = Array.from(new Set(products.flatMap(p => p.allergens)));
      recipeAllergensMap.value.set(recipe.title, allergens);
      const energy = calculateCaloriesMap(recipe.products, productsFullProp.value);
      recipeEnergyMap.value.set(recipe.title, energy);
    }
  } catch (e) {
    console.error(e);
  }
}

const fetchProducts = async (recipe: Recipe) => {
  const token = getCookie("token");
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const params = {
      ids: recipe.products.map(product => product.productId).join(',')
    }

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`,
        {
          params,
          headers,
        });

    productsFullProp.value = response.data;
    productsViewProp.value = response.data.map((productRaw: ProductFull) => getProductView(productRaw));

  } catch (e) {
    console.error(e);
  }
}

function getRecipeAllergens(title: string): string[] {
  return recipeAllergensMap.value.get(title) || [];
}

function setCurrentPage(page: number) {
  filters.currentPage = page;
}

function calculateCaloriesMap(
    products: ProductRecipe[],
    viewProducts: ProductFull[]
): number {
  let total = 0;

  for (const product of products) {
    const fullProduct = viewProducts.find(p => p.id === product.productId);
    if (!fullProduct) continue;

    const energyPer100g = fullProduct.energy || 0;
    const quantity = product.quantity || 0;

    total += Math.round((energyPer100g / 100) * quantity);
  }

  return total;
}

const onChangeSearchInput = () => {
  console.log("onChangeSearchInput");
  const target = document.querySelector('input[type="text"]') as HTMLInputElement;
  filters.searchQuery = target.value;
  filters.currentPage = 1;
}

function handlePopupCloseEvent() {
  selectedRecipe.value = null;
  popupState.value = false;
}
function handlePopupOpen(recipe: Recipe) {
  selectedRecipe.value = recipe;
  popupState.value = true;
}

onMounted(fetchItems);
watch(filters, fetchItems)
</script>

<template>
  <div class="w-9/10 bg-white m-auto rounded-3xl shadow-2xl mt-5">
    <Header/>
    <RecipePopup
        v-if="popupState && selectedRecipe !== null"
        :recipe="selectedRecipe"
        :calories="recipeEnergyMap.get(selectedRecipe.title) || 0"
        @popupCloseEvent="handlePopupCloseEvent"
    />
    <div class="p-5">
      <div class="pb-5">
          <div class="flex justify-between items-center">
            <h2 class="font-[Karla] font-extrabold text-3xl">Recipes</h2>
            <div class="relative">
              <img @click="onChangeSearchInput" class="absolute left-3 top-3 cursor-pointer"
                   src="../src/assets/icons/zoom.svg" alt="zoom">
              <input
                  @keyup.enter="onChangeSearchInput"
                  class="font-[Karla] font-light border border-gray-300 hover:border-gray-500 rounded-md py-2 pl-10 pr-4 outline-none"
                  type="text"
                  placeholder="Search..."
                  autocomplete="off">
            </div>
          </div>
      </div>
        <div class="flex flex-wrap gap-5" v-auto-animate>
          <RecipePage
              v-for="recipe in recipes"
              :name="recipe.title || ''"
              :img="recipe.photoBase64 || ''"
              :calories="recipeEnergyMap.get(recipe.title) || 0"
              :allergens="getRecipeAllergens(recipe.title)"
              @click="handlePopupOpen(recipe)"
          />
        </div>
      <div class="py-5 flex justify-center">
      <ul class="flex gap-4" v-auto-animate>
        <li v-for="page in getPageRange(filters.currentPage, availablePageNumber)"
            :key="page"
            :class="['cursor-pointer select-none', page === filters.currentPage ? 'font-bold' : '']"
            @click="setCurrentPage(page)">
          {{ page }}
        </li>
      </ul>
    </div>
    </div>
  </div>
</template>