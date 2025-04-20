<script setup lang="ts">
import {reactive, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const pageInfo = reactive({
  page: "products",
});


watch(
    () => route.path,
    (newPath) => {
      if (newPath.includes("products")) {
        pageInfo.page = "products";
      } else if (newPath.includes("profile")) {
        pageInfo.page = "profile";
      } else {
        pageInfo.page = "products";
      }
    },
    { immediate: true }
)
</script>

<template>
  <router-view></router-view>
</template>