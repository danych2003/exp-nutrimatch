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

const productPopupState = reactive({
  product: {
    productId: "",
  }
})

const product = ref<ProductFull>();

const popupStateProp = ref(false);

function handlePopupEvent() {
  popupStateProp.value = !popupStateProp.value;

  product.value = productsFull.value.find(
      product => product.id === Number(productPopupState.product.productId)
  )
}

watch(productPopupState, handlePopupEvent)
const productsFull = ref<ProductFull[]>([]);

const products = ref<ViewProduct[]>([]);

const availablePageNumber = ref(0)

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

    const response = await axios.get(`http://localhost:8443/api/product`,
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

</script>

<template>
  <ProductPopup
      v-if="popupStateProp"
      :product-popup-state="productPopupState"
      :product="product!"
  />
  <div class="w-9/10 bg-white m-auto rounded-3xl shadow-2xl mt-5">
    <Header/>
    <ProductList
        :products="products"
        :filters="filters"
        :productPopupState="productPopupState"
        :availablePageNumber="availablePageNumber"
    />
  </div>
</template>
