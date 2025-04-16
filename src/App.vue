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
import {email, helpers, minLength, required} from "@vuelidate/validators";
import {Md5} from "ts-md5";

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
});

const filters = reactive({
  sortBy: '',
  searchQuery: '',
  currentPage: 1,
})

const token = ref("")

const fetchItems = async () => {
  try {
    const params = {
      search_query: filters.searchQuery,
      current_page: filters.currentPage - 1,
    };
    const headers = {
      Authorization: `Bearer ${token.value}`,
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

const containsNumber = helpers.withMessage(
    'Password must contain at least one number.',
    (value: string) =>
      /\d/.test(value)
);

const validateEmail = helpers.withMessage(
    'Incorrect email address.',
    (value: string) =>
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
);

const passwordsShouldBeSimilar = helpers.withMessage(
    'Passwords are not match.',
    (value: string) =>
        value === form.registrationForm.confirmPassword
);
const rulesLogin = {
  username: {
    required,
    minLength: minLength(5),
  },
  password: {
    required,
    minLength: minLength(7),
    containsNumber,
  },
};

const rulesRegistration = {
  email: {
    validateEmail
  },
  username: {
    required,
    minLength: minLength(5),
  },
  password: {
    required,
    minLength: minLength(7),
    containsNumber,
    passwordsShouldBeSimilar,
  },
};


const v$Login = useVuelidate(rulesLogin, form.loginForm);
const v$Register = useVuelidate(rulesRegistration, form.registrationForm);

function setCurrentPage(page: number) {
  filters.currentPage = page;
  console.log(filters.currentPage)
}
const submitPressed = ref(false);
const submitLoginForm = async () => {
  submitPressed.value = true;
  await v$Login.value.$validate();
  if (v$Login.value.$invalid) {
    console.log(v$Login.value.$errors);
  } else {
    LoginStatusProp.LoginStatus = await login();
    await fetchItems();
  }
};
const submitRegistrationForm = async () => {
  submitPressed.value = true;
  await v$Register.value.$validate();
  if (v$Register.value.$invalid) {
    console.log(v$Register.value.$errors);
  } else {
    await register();
  }
};

const register = async () => {
  const password = Md5.hashStr(form.registrationForm.password)
  console.log(password);
  let data: { username: string; passwordHash: string; email?: string; firstName?: string; lastName?: string } = {
    username: form.registrationForm.username,
    passwordHash: password,
  };

  if(form.registrationForm.email !== '') {
    data.email = form.registrationForm.email;
  }

  if(form.registrationForm.lastName !== '') {
    data.lastName = form.registrationForm.lastName;
  }

  if(form.registrationForm.firstName !== '') {
    data.firstName = form.registrationForm.firstName;
  }

  const response = await axios.post(`http://localhost:8443/api/register`, data);
  console.log(response.data);

  if (response.status === 200) {
    alert("please login!");
    LoginStatusProp.PageState = 'login';
    return true;
  }
  return false;
}

const login = async () => {
  const password = Md5.hashStr(form.loginForm.password)
  console.log(password);
  const data = {
    username: form.loginForm.username,
    passwordHash: password,
  };

  const response = await axios.post(`http://localhost:8443/api/login`, data);
  console.log(response.data);

  if (response.status === 200) {
    document.cookie = "token=" + response.data;
    token.value = response.data;
    return true;
  }
  return false;
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
    token.value = getCookie("token");
    LoginStatusProp.LoginStatus = true;
  }
}
function isLoggedIn() {

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
      <div v-if="LoginStatusProp.PageState === 'login'">
        <div class="p-5 flex justify-center">
          <div class="block">
          <h2 class="font-[Karla] font-extrabold text-3xl pb-6">Login in</h2>
            <div v-if="v$Login?.$error && submitPressed" class="bg-red-600 p-4 mb-3 text-white rounded-xl">
              <div v-for="(error, field) in v$Login?.$errors" :key="field" class="flex justify-center">
                <p>{{ error.$message }}</p>
              </div>
            </div>
          <input
              v-model="form.loginForm.username"
              class="flex font-[Karla] text-xl w-70 font-light border border-gray-300 hover:border-gray-500 rounded-md py-2 pl-3 pr-4 outline-none"
              type="text"
              placeholder="Username"
              autocomplete="off">
          <input
              v-model="form.loginForm.password"
              class="flex font-[Karla] text-xl w-70 font-light border border-gray-300 hover:border-gray-500 rounded-md mt-3 py-2 pl-3 pr-4 outline-none"
              type="password"
              placeholder="Password"
              autocomplete="off">
            <button
                @click="submitLoginForm"
                class="bg-orange-400 mt-5 ml-19 hover:bg-orange-500 text-white font-bold py-2 px-10 border border-orange-500 rounded cursor-pointer">
              Submit
            </button>
            <div @click="changeAuthPageState" class="flex justify-center font-[Karla] font-light text-blue-500 cursor-pointer hover:text-blue-950">Create an account?</div>
          </div>
        </div>
      </div>
      <div v-if="LoginStatusProp.PageState === 'registration'">
        <div class="p-5 flex justify-center">
          <div class="flex flex-col gap-y-2">
            <h2 class="font-[Karla] font-extrabold text-3xl pb-6">Registration</h2>
            <div v-if="v$Register?.$error && submitPressed" class="bg-red-600 p-4 mb-3 text-white rounded-xl">
              <div v-for="(error, field) in v$Register?.$errors" :key="field" class="flex justify-center">
                <p>{{ error.$message }}</p>
              </div>
            </div>
            <input
                v-model="form.registrationForm.email"
                class="flex font-[Karla] text-xl w-70 font-light border border-gray-300 hover:border-gray-500 rounded-md py-2 pl-3 pr-4 outline-none"
                type="email"
                placeholder="Email"
                autocomplete="off">
            <input
                v-model="form.registrationForm.username"
                class="flex font-[Karla] text-xl w-70 font-light border border-gray-300 hover:border-gray-500 rounded-md py-2 pl-3 pr-4 outline-none"
                type="text"
                placeholder="Username*"
                autocomplete="off">
            <input
                v-model="form.registrationForm.firstName"
                class="flex font-[Karla] text-xl w-70 font-light border border-gray-300 hover:border-gray-500 rounded-md py-2 pl-3 pr-4 outline-none"
                type="text"
                placeholder="First name"
                autocomplete="off">
            <input
                v-model="form.registrationForm.lastName"
                class="flex font-[Karla] text-xl w-70 font-light border border-gray-300 hover:border-gray-500 rounded-md py-2 pl-3 pr-4 outline-none"
                type="text"
                placeholder="Last name"
                autocomplete="off">
            <input
                v-model="form.registrationForm.password"
                class="flex font-[Karla] text-xl w-70 font-light border border-gray-300 hover:border-gray-500 rounded-md py-2 pl-3 pr-4 outline-none"
                type="password"
                placeholder="Password*"
                autocomplete="off">
            <input
                v-model="form.registrationForm.confirmPassword"
                class="flex font-[Karla] text-xl w-70 font-light border border-gray-300 hover:border-gray-500 rounded-md py-2 pl-3 pr-4 outline-none"
                type="password"
                placeholder="Confirm password*"
                autocomplete="off">
            <button
                @click="submitRegistrationForm"
                class="bg-orange-400 mt-5 hover:bg-orange-500 text-white font-bold py-2 px-10 border border-orange-500 rounded cursor-pointer">
              Submit
            </button>
            <div @click="changeAuthPageState" class="flex justify-center font-[Karla] font-light text-blue-500 cursor-pointer hover:text-blue-950">Have an account?</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
