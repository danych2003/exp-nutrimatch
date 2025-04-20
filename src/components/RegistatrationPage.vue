<script setup lang="ts">
import {helpers, maxLength, minLength, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {type Reactive, ref} from "vue";
import LoginPage from "@/components/LoginPage.vue";
import type { Ref } from 'vue'
import axios from "axios";
import {parseError} from "@/utils/ErrorMapper.ts";
import type {ErrorResponse} from "@/model/ErrorResponse.ts";

const props = defineProps<{
  loginStatusProp: {
    LoginStatus: boolean
    PageState: string
    SubmitPressed: boolean
    token: string
  }
  form: {
    loginForm: {
      username: string,
      password: string,
    },
    registrationForm: {
      email: string,
      username: string,
      firstName: string,
      lastName: string,
      password: string,
      confirmPassword: string,
    }
  }
  fetchItems: () => Promise<any>
  changeAuthPageState: () => void
}>()
const serverError = ref<ErrorResponse>();

const containsNumber = helpers.withMessage(
    'Password must contain at least one number.',
    (value: string) =>
        /\d/.test(value)
);

const validateEmail = helpers.withMessage(
    'Incorrect email address.',
    (value: string) =>
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) || value === ""
);

const passwordsShouldBeSimilar = helpers.withMessage(
    'Passwords are not match.',
    (value: string) =>
        value === props.form.registrationForm.confirmPassword
);

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
    maxLength: maxLength(20),
    containsNumber,
    passwordsShouldBeSimilar,
  },
};

const v$Register = useVuelidate(rulesRegistration, props.form.registrationForm);

const submitRegistrationForm = async () => {
  props.loginStatusProp.SubmitPressed = true;
  await v$Register.value.$validate();
  if (v$Register.value.$invalid) {
    console.log(v$Register.value.$errors);
  } else {
    const response = await register();
    if (response.success) {
      props.loginStatusProp.PageState = 'login';
    } else if (response.statusCode === 400) {
      serverError.value = response.message;
    }
  }
};

const register = async () => {
  let data: { username: string; password: string; email?: string; firstName?: string; lastName?: string } = {
    username: props.form.registrationForm.username,
    password: props.form.registrationForm.password,
  };

  if(props.form.registrationForm.email !== '') {
    data.email = props.form.registrationForm.email;
  }

  if(props.form.registrationForm.lastName !== '') {
    data.lastName = props.form.registrationForm.lastName;
  }

  if(props.form.registrationForm.firstName !== '') {
    data.firstName = props.form.registrationForm.firstName;
  }
  try {
    const response = await axios.post(`http://localhost:8443/api/register`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data,
      statusCode: error.response?.status
    };
  }
}


</script>

<template>
  <div v-if="props.loginStatusProp.PageState === 'registration'">
    <div class="p-5 flex justify-center">
      <div class="flex flex-col gap-y-2">
        <h2 class="font-[Karla] font-extrabold text-3xl pb-6">Registration</h2>
        <div v-if="v$Register?.$error && loginStatusProp.SubmitPressed" class="bg-red-600 p-4 mb-3 text-white rounded-xl">
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
</template>

<style scoped>

</style>