<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {getProductView} from "@/utils/ProductMapper.ts";
import axios from "axios";

import Header from "@/components/Header.vue";
import ProductList from "@/components/ProductList.vue";
import type {ProductFull} from "@/model/ProductFull.ts";
import type {ViewProduct} from "@/model/ViewProduct.ts";
import ProductPopup from "@/components/ProductPopup.vue";
import {getCookie} from "@/utils/LoginHelper.ts";
import { provide } from 'vue'
import router from "@/router/Router.ts";
import {useRoute} from "vue-router";
import {useRecipeStore} from "@/stores/RecipeCreateStore.ts";
import {storeToRefs} from "pinia";

const productState = reactive({
  product: {
    productId: "",
  }
})

const product = ref<ProductFull>();

const productsFull = ref<ProductFull[]>([]);

const products = ref<ViewProduct[]>([]);

const availablePageNumber = ref(0)

const route = useRoute();

const filters = reactive({
  sortBy: '',
  searchQuery: '',
  currentPage: 1,
})

watch(productState, handleClickEvent)

const popupStateProp = ref(false);

function handleClickEvent() {
  popupStateProp.value = !popupStateProp.value;
  const recipeStore = useRecipeStore();

  product.value = productsFull.value.find(
      product => product.id === Number(productState.product.productId)
  )

  recipeStore.addProduct(Number(productState.product.productId), 100);

  router.push({
    path: '/recipes/create',
  });
}

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

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product`,
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

    const newProducts = response.data.map((productRaw: ProductFull) => getProductView(productRaw));
    productsFull.value = response.data;
    products.value = newProducts;

  } catch (e) {
    console.error(e);
  }
}

onMounted(fetchItems);

watch(filters, fetchItems)

provide('type', 'choose')

</script>

<template>
  <div class="w-9/10 bg-white m-auto rounded-3xl shadow-2xl mt-5">
    <Header/>
    <ProductList
        :products="products"
        :filters="filters"
        :productPopupState="productState"
        :availablePageNumber="availablePageNumber"
    />
  </div>
</template>
