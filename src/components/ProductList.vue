<script setup lang="ts">
import Product from "@/components/Product.vue";
import type {ViewProduct} from "@/model/ViewProduct.ts";
import {getPageRange} from "@/utils/PageHelper.ts";

interface ProductListProps {
  products: ViewProduct[];
  filters: {
    sortBy: string,
    searchQuery: string,
    currentPage: number,
  };
  productPopupState: {
    product: {
      productId: string,
    }
  };
  availablePageNumber: number;
}

const productListProps = defineProps<ProductListProps>();

const onChangeSearchInput = () => {
  const target = document.querySelector('input[type="text"]') as HTMLInputElement;
  productListProps.filters.searchQuery = target.value;
  productListProps.filters.currentPage = 1;
}

function setId(id: string) {
  productListProps.productPopupState.product.productId = id;
}

function setCurrentPage(page: number) {
  productListProps.filters.currentPage = page;
}


</script>

<template>
  <div class="p-5">
    <div class="pb-5">
      <div class="pb-5">
        <div class="flex justify-between">
          <h2 class="font-[Karla] font-extrabold text-3xl">Products</h2>
          <div class="relative">
            <img @click="onChangeSearchInput" class="absolute left-3 top-3 cursor-pointer"
                 src="../assets/icons/zoom.svg" alt="zoom">
            <input
                @keyup.enter="onChangeSearchInput"
                class="font-[Karla] font-light border border-gray-300 hover:border-gray-500 rounded-md py-2 pl-10 pr-4 outline-none"
                type="text"
                placeholder="Search..."
                autocomplete="off">
          </div>
        </div>
      </div>


      <div class="flex justify-between px-4 text-2xl font-[Karla] font-medium">
        <div>
          Name
        </div>
        <div>
          Type
        </div>
        <div>
          Allergens
        </div>
      </div>
    </div>

    <div class="space-y-2" v-auto-animate>
      <Product
          @click="setId(product.id)"
          v-for="product in productListProps.products"
          :name="product.name || ''"
          :type="product.type || ''"
          :allergens="product.allergens"/>
    </div>
  </div>
  <div class="py-5 flex justify-center">
    <ul class="flex gap-4" v-auto-animate>
      <li v-for="page in getPageRange(filters.currentPage, productListProps.availablePageNumber)"
          :key="page"
          :class="['cursor-pointer select-none', page === filters.currentPage ? 'font-bold' : '']"
          @click="setCurrentPage(page)">
        {{ page }}
      </li>
    </ul>
  </div>
</template>
