<script setup lang="ts">
import Product from "@/components/Product.vue";
import type {ViewProduct} from "@/model/ViewProduct.ts";

interface Products {
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
}

const products = defineProps<Products>();

const onChangeSearchInput = () => {
  const target = document.querySelector('input[type="text"]') as HTMLInputElement;
  products.filters.searchQuery = target.value;
  products.filters.currentPage = 1;
  console.log(products.filters.searchQuery);
}

function setId(id: string) {
  products.productPopupState.product.productId = id;
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

    <div class="space-y-2">
      <Product
          @click="setId(product.id)"
          v-for="product in products.products"
          :name="product.name || ''"
          :type="product.type || ''"
          :allergens="product.allergens"/>
    </div>
  </div>
</template>
