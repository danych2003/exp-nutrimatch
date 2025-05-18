<script setup lang="ts">
import Header from "@/components/Header.vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import {extractUserNameFromJwt, getCookie} from "@/utils/LoginHelper.ts";
import type {Recipe} from "@/model/Recipe.ts";
import type {ProductRecipe} from "@/model/ProductRecipe.ts";
import type {ErrorResponse} from "@/model/ErrorResponse.ts";
import router from "@/router/Router.ts";
import {useRoute} from "vue-router";
import type {ProductFull} from "@/model/ProductFull.ts";
import {useRecipeStore} from "@/stores/RecipeCreateStore.ts";

const imagePreview = ref('');
const title = ref('');
const description = ref('');
const imageBase64 = ref<string | null>(null)
const productsFull = ref<ProductFull[]>([]);
const recipeStore = useRecipeStore();

const quantities = ref<Record<number, number>>({})

const route = useRoute();

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxWidth = 700
      const maxHeight = 700

      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(img, 0, 0, width, height)

      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.3)
      imageBase64.value = compressedDataUrl
      imagePreview.value = compressedDataUrl
    }
    img.src = reader.result as string
  }

  reader.readAsDataURL(file)
}

const saveRecipe = async () => {
  if (!title.value || !description.value || !(imagePreview.value || imageBase64.value)) {
    console.error("Please fill in all fields and upload an image.");
    return;
  }

  const productRecipes: ProductRecipe[] = [];

  Object.keys(quantities.value).forEach((productId) => {
    productRecipes.push({
      productId: parseInt(productId),
      quantity: quantities.value[parseInt(productId)],
      unit: 'gram',
    })
  })

  const token = getCookie("token");
  const recipe: Recipe = {
    title: title.value,
    description: description.value,
    photoBase64: imageBase64?.value,
    username: extractUserNameFromJwt(token),
    products: productRecipes
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    await axios.post('http://localhost:8443/api/recipe', recipe, { headers })
        .then(() => router.push('/recipes'));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as ErrorResponse;
      console.error(`ErrorCode: ${data.errorCode}, Message: ${data.errorMessage}`);
    } else {
      console.error('Recipe sending error:', error);
    }
  }
};

title.value = recipeStore.title;
description.value = recipeStore.description;
imageBase64.value = recipeStore.photoBase64;

async function redirectToProducts() {


  if (description.value) {
    recipeStore.setDescription(description.value);
  }
  if (title.value) {
    recipeStore.setTitle(title.value);
  }
  if (imageBase64.value) {
    recipeStore.setPhotoBase64(imageBase64.value);
  }

  await router.push({
    path: '/recipes/create/choose'
})
}

const fetchProducts = async () => {
  const token = getCookie("token");
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const params = {
      ids: recipeStore.getProductIds().join(',')
    }

    const response = await axios.get(`http://localhost:8443/api/products`,
        {
          params,
          headers,
        });

    productsFull.value = response.data.map((productRaw: ProductFull) => productRaw);
  } catch (e) {
    console.error(e);
  }
}


const getProductName = (names: ProductFull['productNames']) => {
  const name = names.find(n => n.language === 'et') || names[0]
  return name?.name || 'No name'
}

onMounted(async () => {
  if (recipeStore.getProductIds().length > 0) {
    await fetchProducts();
  }
});

</script>

<template>
  <div class="w-9/10 bg-white m-auto rounded-3xl shadow-2xl mt-5 font-[Karla] font-medium">
    <Header/>
    <form @submit.prevent="saveRecipe" class="space-y-6 p-5">
      <div class="flex justify-between">
        <div class="block">
        <label class="block text-lg font-semibold mb-2">Recipe Image</label>
        <input
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        <div v-if="imagePreview || imageBase64" class="mt-4">
          <img
              :src="imagePreview || imageBase64 || undefined"
               alt="Preview"
               class="w-45 h-auto rounded-xl border" />
        </div>
        </div>


        <div class="flex">
          Cl🔥: {{ productsFull.reduce((accumulator, product) => {
          return accumulator + Math.round((product.energy / 100) * (quantities[product.id] | 0));
        },0) }}
        </div>

      </div>

      <div>
        <label class="block text-lg font-semibold mb-2">Title</label>
        <input
            v-model="title"
            type="text"
            class="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="Enter recipe title"
        />
      </div>

      <div>
        <label class="block text-lg font-semibold mb-2">Description</label>
        <textarea
            v-model="description"
            rows="5"
            class="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="Describe your recipe..."
        ></textarea>
      </div>
      <div class="text-left">
        <button
            @click="redirectToProducts()"
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"
        >
          Add product
        </button>
      </div>

      <div
          v-for="product in productsFull"
          :key="product.id"
          class="bg-gray-200 rounded-lg w-full flex justify-between items-center px-4 py-2 hover:translate-x-1 cursor-pointer transition font-[Karla] font-light mb-2"
      >
        <div>
          {{ getProductName(product.productNames) }}
        </div>
        <div>
          <input
              type="number"
              v-model.number="quantities[product.id]"
              placeholder="Qty"
              class="w-20 px-2 py-1 rounded border border-gray-400 text-sm"
          />
          Grams
        </div>
      </div>

      <div class="text-right">
        <button
            type="submit"
            class="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 cursor-pointer"
        >
          Save Recipe
        </button>
      </div>
    </form>
  </div>
</template>