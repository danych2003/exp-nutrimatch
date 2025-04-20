<script setup lang="ts">
import {defineComponent, onMounted, reactive, ref, watch} from "vue";
import {getProductView} from "@/utils/ProductMapper.ts";
import axios from "axios";

import Header from "@/components/Header.vue";
import ProductList from "@/components/ProductList.vue";
import type {ProductFull} from "@/model/ProductFull.ts";
import type {ViewProduct} from "@/model/ViewProduct.ts";
import ProductPopup from "@/components/ProductPopup.vue";
import HeaderUnauthorized from "@/components/HeaderUnauthorized.vue";
import useVuelidate from "@vuelidate/core";
import {email, helpers, maxLength, minLength, required} from "@vuelidate/validators";
import LoginPage from "@/components/LoginPage.vue";
import RegistatrationPage from "@/components/RegistatrationPage.vue";

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
  console.log(product);
}


watch(productPopupState, handlePopupEvent)

const productsFull = ref<ProductFull[]>([]);
const products = ref<ViewProduct[]>([]);

const availablePageNumber = ref(0)
const LoginStatusProp = reactive({
    LoginStatus: false,
    PageState: "login",
    SubmitPressed: false,
    token: "",
});

const filters = reactive({
  sortBy: '',
  searchQuery: '',
  currentPage: 1,
})

const fetchItems = async () => {
  try {
    const params = {
      search_query: filters.searchQuery,
      current_page: filters.currentPage - 1,
    };
    const headers = {
      Authorization: `Bearer ${LoginStatusProp.token}`,
    };

    const response = await axios.get(`http://localhost:8443/api/product`,
        {
          params,
          headers,
        });
    console.log(response.data);

    const availablePages = response.headers["x-available-pages"];
    if (availablePages) {
      availablePageNumber.value = parseInt(availablePages);
      console.log(availablePages);
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

function getPageRange(currentPage: number, available: number): number[] {
  if (currentPage < 0 || available <= 0) {
    return [1];
  }

  const maxPagesToShow = 5;
  let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
  let endPage = Math.min(startPage + maxPagesToShow - 1, available);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  }

  const pageRange = [];
  for (let i = startPage; i <= endPage; i++) {
    pageRange.push(i);
  }

  return pageRange;
}

const form = reactive({
  loginForm: {
    username: '',
    password: '',
  },
  registrationForm: {
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  }
});

function setCurrentPage(page: number) {
  filters.currentPage = page;
  console.log(filters.currentPage)
}



function getCookie(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

if(LoginStatusProp.LoginStatus) {
  onMounted(fetchItems)
} else {
  if(getCookie("token") !== "") {
    LoginStatusProp.token = getCookie("token");
    LoginStatusProp.LoginStatus = true;
  }
}

function changeAuthPageState() {
  if(LoginStatusProp.PageState === 'login') {
    LoginStatusProp.PageState = 'registration';
    form.loginForm.password = '';
    form.loginForm.username = '';
  } else {
    LoginStatusProp.PageState = 'login';
    form.registrationForm.password = '';
    form.registrationForm.username = '';
    form.registrationForm.lastName  = '';
    form.registrationForm.firstName  = '';
    form.registrationForm.email  = '';
  }
}

if(LoginStatusProp.LoginStatus) {
  onMounted(fetchItems())
}

watch(filters, fetchItems)

</script>

<template>
  <div v-if="LoginStatusProp.LoginStatus">
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
      />

      <div class="py-5 flex justify-center">
        <ul class="flex gap-4">
          <li v-for="page in getPageRange(filters.currentPage, availablePageNumber)"
              :key="page"
              :class="['cursor-pointer', page === filters.currentPage ? 'font-bold' : '']"
              @click="setCurrentPage(page)">
            {{ page }}
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div v-if="!LoginStatusProp.LoginStatus">
    <div class="w-1/2 bg-white m-auto rounded-3xl shadow-2xl mt-5">
      <HeaderUnauthorized/>
      <LoginPage
      :loginStatusProp="LoginStatusProp"
      :form="form"
      :fetchItems="fetchItems"
      :changeAuthPageState="changeAuthPageState"/>
      <RegistatrationPage
          :loginStatusProp="LoginStatusProp"
          :form="form"
          :fetchItems="fetchItems"
          :changeAuthPageState="changeAuthPageState"/>
    </div>
  </div>
</template>

<style scoped>
</style>
