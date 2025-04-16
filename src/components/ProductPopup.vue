<script setup lang="ts">
import type {ProductFull} from "@/model/ProductFull.ts";

const props = defineProps<{
  product: ProductFull;
  productPopupState: {
    product: {
      productId: string,
    }
  }
}>()

function closePopup() {
  props.productPopupState.product.productId = "";
}
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

        <h2 class="font-[Karla} font-bold text-2xl">Name:</h2>
        <div class="font-[Karla} font-medium text-xl">
          <div v-if="props.product.productNames.find(p => p.language === 'ET')" class="flex gap-1">
            <img class="w-5 h-3 mt-2" src="../assets/icons/flags/et.png" alt="flag">
            {{ props.product.productNames.find(p => p.language === 'ET')?.name }}
          </div>

          <div v-if="props.product.productNames.find(p => p.language === 'EN')" class="flex gap-1">
            <img class="w-5 h-3 mt-2" src="../assets/icons/flags/uk.svg" alt="flag">
            {{ props.product.productNames.find(p => p.language === 'EN')?.name }}
          </div>

          <div v-if="props.product.productNames.find(p => p.language === 'LV')" class="flex gap-1">
            <img class="w-5 h-3 mt-2" src="../assets/icons/flags/lv.png" alt="flag">
            {{ props.product.productNames.find(p => p.language === 'LV')?.name }}
          </div>

          <div v-if="props.product.productNames.find(p => p.language === 'RU')" class="flex gap-1">
            <img class="w-5 h-3 mt-2" src="../assets/icons/flags/ru.png" alt="flag">
            {{ props.product.productNames.find(p => p.language === 'RU')?.name }}
          </div>
        </div>


        <h2 class="font-[Karla} font-bold text-2xl">Energy:</h2>
        <div class="font-[Karla} font-medium text-xl">
          🔥{{ props.product.energy }} Kcal per 100 gram
        </div>

        <h2 class="font-[Karla} font-bold text-2xl">Food groups:</h2>
        <div class="font-[Karla} font-medium text-xl">
          {{ props.product.foodGroup }}
        </div>


        <h2 class="font-[Karla} font-bold text-2xl">Elements:</h2>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-red-400">
            <thead class="text-xs uppercase bg-amber-600 text-white">
            <tr>
              <th v-for="element in props.product.elements" :key="element.id" class="px-6 py-3">
                {{ element.name }} gram
              </th>
            </tr>
            </thead>
            <tbody>
            <tr class="bg-amber-200 border-gray-200">
              <td v-for="(element, index) in props.product.elements" :key="element.id"
                  :class="index % 2 === 0 ? 'bg-amber-300' : 'bg-amber-200'"
                  class="px-6 py-4 font-medium whitespace-nowrap text-red-400">
                {{ element.quantity }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>