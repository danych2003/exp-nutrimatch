<script setup lang="ts">
import {helpers, minLength, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {reactive, type Reactive, ref} from "vue";
import axios from "axios";
import {parseError} from "@/utils/ErrorMapper.ts";
import type {ErrorResponse} from "@/model/ErrorResponse.ts";
import router, {changeAppScreenState} from "@/router/Router.ts";
import HeaderUnauthorized from "@/components/HeaderUnauthorized.vue";
import {isLoggedIn} from "@/utils/LoginHelper.ts";

const serverError = ref<ErrorResponse>();

if(isLoggedIn()) {
  changeAppScreenState("products");
}

const containsNumber = helpers.withMessage(
    'Password must contain at least one number.',
    (value: string) =>
        /\d/.test(value)
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

const loginStatusProp = reactive({
  SubmitPressed: false,
  token: "",
  loginStatus: false,
});

const submitLoginForm = async () => {
  loginStatusProp.SubmitPressed = true;
  await v$Login.value.$validate();
  if (v$Login.value.$invalid) {
  } else {
    const response = await login();
    if (response.success) {
      document.cookie = "token=" + response.data;
      changeAppScreenState("products")
    } else {
      serverError.value = response.message;
    }
  }
};

const form = reactive({
  loginForm: {
    username: 'Daniil1234',
    password: 'Nicekill123.3',
  }
});

const login = async () => {
  const data = {
    username: form.loginForm.username,
    password: form.loginForm.password,
  };

  try {
    const response = await axios.post(`http://localhost:8443/api/login`, data);
    return {success: true, data: response.data};
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.response?.data,
      statusCode: error.response?.status
    };
  }
};


const v$Login = useVuelidate(rulesLogin, form.loginForm);


</script>

<template>
  <div class="w-1/2 bg-white m-auto rounded-3xl shadow-2xl mt-5">
    <HeaderUnauthorized/>
    <div class="p-5 flex justify-center">
      <div class="block">
        <h2 class="font-[Karla] font-extrabold text-3xl pb-6">Login in</h2>
        <div v-if="v$Login?.$error && loginStatusProp.SubmitPressed" class="bg-red-600 p-4 mb-3 text-white rounded-xl">
          <div v-for="(error, field) in v$Login?.$errors" :key="field" class="flex justify-center">
            <p>{{ error.$message }}</p>
          </div>
        </div>
        <div v-if="serverError" class="bg-red-600 p-4 mb-3 text-white rounded-xl">
          <p class="flex justify-center">{{ serverError.errorMessage }}</p>
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
            autocomplete="off"
            >
        <button
            @click="submitLoginForm"
            class="bg-orange-400 mt-5 ml-19 hover:bg-orange-500 text-white font-bold py-2 px-10 border border-orange-500 rounded cursor-pointer">
          Submit
        </button>
        <div @click="changeAppScreenState('register')"
             class="flex justify-center font-[Karla] font-light text-blue-500 cursor-pointer hover:text-blue-950">Create
          an account?
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>