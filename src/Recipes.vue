<script setup lang="ts">


import ProductList from "@/components/ProductList.vue";
import Header from "@/components/Header.vue";
import ProductPopup from "@/components/ProductPopup.vue";
import {getPageRange} from "@/utils/PageHelper.ts";
import {onMounted, reactive, ref, watch} from "vue";
import {getCookie} from "@/utils/LoginHelper.ts";
import axios from "axios";
import type {ProductFull} from "@/model/ProductFull.ts";
import {getAllergens, getProductView} from "@/utils/ProductMapper.ts";
import type {Recipe} from "@/model/Recipe.ts";
import Product from "@/components/Product.vue";
import RecipePage from "@/components/RecipePage.vue";
import type {ProductRecipe} from "@/model/ProductRecipe.ts";

const availablePageNumber = ref(0)
const recipes = ref<Recipe[]>([]);
const filters = reactive({
  sortBy: '',
  searchQuery: '',
  currentPage: 1,
})

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

    const response = await axios.get(`http://localhost:8443/api/recipes`,
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

  } catch (e) {
    console.error(e);
  }
}

function setCurrentPage(page: number) {
  filters.currentPage = page;
}

function getCalories(products: ProductRecipe[]) {
  let accumulator = 0;
  products.map((product: ProductRecipe) => {
    accumulator = accumulator + product.quantity;
  })
  return accumulator
}

const onChangeSearchInput = () => {
  console.log("onChangeSearchInput");
  const target = document.querySelector('input[type="text"]') as HTMLInputElement;
  filters.searchQuery = target.value;
  filters.currentPage = 1;
}
onMounted(fetchItems);
watch(filters, fetchItems)
</script>

<template>
  <div class="w-9/10 bg-white m-auto rounded-3xl shadow-2xl mt-5">
    <Header/>
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
              :callories="getCalories(recipe.products)"
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