<script setup lang="ts">


import ProductList from "@/components/ProductList.vue";
import Header from "@/components/Header.vue";
import ProductPopup from "@/components/ProductPopup.vue";
import {extractUserNameFromJwt, getCookie} from "@/utils/LoginHelper.ts";
import axios from "axios";
import {ref, onMounted, watch} from "vue";
import {getUserFromJson} from "@/utils/UserMapper.ts";
import type {User} from "@/model/User.ts";
import avatarImage from '@/assets/icons/unknown_avatar.jpg'

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
    imageBase64.value = reader.result as string
    imagePreview.value = reader.result as string
  }
  reader.readAsDataURL(file)
}

const saveImage = async () => {
  if (imageBase64.value) {
    console.log('Base64 Image:', imageBase64.value);

    const token = getCookie("token");
    const username = extractUserNameFromJwt(token);

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain'
    };

    const response = await axios.put(
        `http://localhost:8443/api/user/avatar/${username}`,
        imageBase64.value,
        { headers }
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

  const response = await axios.get(`http://localhost:8443/api/user/${username}`, {
    headers,
  });
  console.log(response);
  user.value = response.data;
}

onMounted(getUser);

</script>

<template>
  <div class="w-9/10 bg-white m-auto rounded-3xl shadow-2xl mt-5">
    <Header/>
    <div class="flex pl-30 p-10 gap-12">
      <div>
        <img class="w-50 р-50 rounded-2xl" :src="user?.avatarBase64 || avatarUrl" alt="avatar" />

        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload file</label>
        <input
            class="pl-1 font-[Karla] block w-full text-sm border rounded-lg cursor-pointer bg-blue-500 text-white outline-none border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            @change="handleFileUpload"
            accept="image/*"
        />

        <div class="flex pt-2">
          <p class="mt-1 text-sm text-blue">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
          <button
              type="button"
              @click="saveImage"
              class="ml-2 px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:outline-none cursor-pointer"
          >
            Upload
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-y-1 font-[Karla] font-bold">
        <div v-if="user" class="flex">
          Username:
          <p class="pl-1 font-light">{{ user.username }}</p>
        </div>
        <div v-if="user?.firstName" class="flex">
          Firstname:
          <p class="pl-1 font-light">{{user?.firstName}}</p>
        </div>
        <div v-if="user?.lastName" class="flex">
          Lastname:
          <p class="pl-1 font-light">{{user?.firstName}}</p>
        </div>
        <div v-if="user?.email" class="flex">
          Email:
          <p class="pl-1 font-light">{{user?.email}}</p>
        </div>
      </div>
    </div>
  </div>
</template>