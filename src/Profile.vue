<script setup lang="ts">


import Header from "@/components/Header.vue";
import {extractUserNameFromJwt, getCookie} from "@/utils/LoginHelper.ts";
import axios from "axios";
import {onMounted, ref} from "vue";
import type {User} from "@/model/User.ts";
import avatarImage from '/icons/unknown_avatar.jpg'
import router from "@/router/Router.ts";
import * as process from "node:process";

const user = ref<User | null>(null)
const error = ref(null)

const imageBase64 = ref<string | null>(null)

const imagePreview = ref<string | null>(null)

const avatarUrl = avatarImage

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

const saveImage = async () => {
  if (imageBase64.value) {

    const token = getCookie("token");
    const username = extractUserNameFromJwt(token);

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain'
    };

    const response = await axios.put(
        `${process.env.VITE_BACKEND_URL}/api/user/avatar/${username}`,
        imageBase64.value,
        {headers}
    );

    user.value = response.data;
    console.log("Avatar updated:", response.data);
  }
};

const getUser = async () => {
  const token = getCookie("token");
  const username = extractUserNameFromJwt(token);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${username}`, {
    headers,
  });
  user.value = response.data;
}

async function redirectToRecipes() {
  await router.push({
    path: '/recipes/create'
  })
}

onMounted(getUser);

</script>

<template>
  <div class="w-9/10 bg-white m-auto rounded-3xl shadow-2xl mt-5">
    <Header/>
    <div class="flex flex-col md:flex-row gap-10 items-start mt-6 p-5">
      <div class="flex flex-col items-center w-full md:w-1/3">
        <img
            class="w-48 h-48 object-cover rounded-2xl border shadow"
            :src="user?.avatarBase64 || avatarUrl"
            alt="avatar"
        />

        <label
            for="file_input"
            class="mt-6 block text-sm font-medium text-gray-700"
        >
          Upload new avatar
        </label>

        <input
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            id="file_input"
            type="file"
            @change="handleFileUpload"
            accept="image/*"
        />

        <button
            @click="saveImage"
            class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition cursor-pointer">
          Upload
        </button>
      </div>

      <div class="w-full md:w-2/3 font-[Karla] space-y-4">
        <div class="text-xl font-bold text-gray-800 mb-2">Profile Information</div>

        <div v-if="user" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <div>
            <span class="font-semibold">Username:</span>
            <p class="text-gray-600">{{ user.username }}</p>
          </div>

          <div v-if="user.firstName">
            <span class="font-semibold">First name:</span>
            <p class="text-gray-600">{{ user.firstName }}</p>
          </div>

          <div v-if="user.lastName">
            <span class="font-semibold">Last name:</span>
            <p class="text-gray-600">{{ user.lastName }}</p>
          </div>

          <div v-if="user.email">
            <span class="font-semibold">Email:</span>
            <p class="text-gray-600">{{ user.email }}</p>
          </div>
        </div>
      </div>
      <button
          @click="redirectToRecipes()"
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"
      >
        Create Recipe
      </button>
    </div>
  </div>
</template>