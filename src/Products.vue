<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {getProductView} from "@/utils/ProductMapper.ts";
import axios from "axios";

import Header from "@/components/Header.vue";
import ProductList from "@/components/ProductList.vue";
import type {ProductFull} from "@/model/ProductFull.ts";
import type {ViewProduct} from "@/model/ViewProduct.ts";
import ProductPopup from "@/components/ProductPopup.vue";
import HeaderUnauthorized from "@/components/HeaderUnauthorized.vue";
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
}

const pageInfo = reactive({
  page: "products",
});

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


function getCookie(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
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

onMounted(() => {
  if (!LoginStatusProp.LoginStatus) {
    const token = getCookie("token");
    if (token !== "") {
      LoginStatusProp.token = token;
      LoginStatusProp.LoginStatus = true;
    }
  }

  if (LoginStatusProp.LoginStatus) {
    fetchItems();
  }
});

function changeAuthPageState() {
  if (LoginStatusProp.PageState === 'login') {
    LoginStatusProp.PageState = 'registration';
    form.loginForm.password = '';
    form.loginForm.username = '';
  } else {
    LoginStatusProp.PageState = 'login';
    form.registrationForm.password = '';
    form.registrationForm.username = '';
    form.registrationForm.lastName = '';
    form.registrationForm.firstName = '';
    form.registrationForm.email = '';
  }
}

if (LoginStatusProp.LoginStatus) {
  onMounted(fetchItems)
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
      <Header
          :pageInfo="pageInfo"
      />
      <ProductList
          :products="products"
          :filters="filters"
          :productPopupState="productPopupState"
          :availablePageNumber="availablePageNumber"
      />
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
