<template>
  <div class="form-header-custom-color"><h2>LOGIN</h2></div>
  <form
    novalidate
    class="form-main form-main-border"
    @submit.prevent="handleSubmit"
  >
    <div class="mb-3">
      <label class="form-label" for="formGroupEmail">Email</label>
      <input
        name="email"
        placeholder="Email"
        type="email"
        id="formGroupEmail"
        class="form-control"
        v-model="email"
      />
    </div>
    <div class="mb-3">
      <label class="form-label" for="formGroupPassword">Password</label>
      <input
        name="password"
        placeholder="Password"
        type="password"
        id="formGroupPassword"
        class="form-control"
        v-model="password"
      />
    </div>
    <div class="d-grid">
      <button type="submit" class="btn-custom-color btn btn-outline-danger">
        LOGIN
      </button>
    </div>
  </form>
  <div class="d-flex align-items-end flex-column">
    <RouterLink class="no-side-padding btn btn-link" to="/register"
      >Join Us!</RouterLink
    >
    <RouterLink class="no-side-padding btn btn-link" to="/forgot-password"
      >Forgot Password</RouterLink
    >
    <RouterLink class="no-side-padding btn btn-link" to="/verification"
      >Verification</RouterLink
    >
  </div>
  <Spinner :show="showSpinner" />
  <template v-if="toastMessage">
    <Toast :message="toastMessage" />
  </template>
</template>

<script>
import { RouterLink } from "vue-router";
import router from "../router";
import UserApiService from "../services/user";
import Spinner from "../common/Spinner.vue";
import Toast from "../common/Toast.vue";

export default {
  name: "LoginPage",
  components: {
    RouterLink,
    Spinner,
    Toast,
  },
  data() {
    return {
      email: "",
      password: "",
      showSpinner: false,
      toastMessage: "",
    };
  },
  methods: {
    async handleSubmit() {
      this.showSpinner = true;
      this.toastMessage = "";
      const formData = { email: this.email, password: this.password };
      await UserApiService.login(formData)
        .then((response) => {
          const { data } = response.data;
          // Set auth token
          const auth = data ? JSON.stringify(data) : null;
          localStorage.setItem("auth-info", auth);
          router.push("/home");
        })
        .catch(({ response }) => {
          this.showSpinner = false;
          if (response?.status === 401) {
            localStorage.setItem("auth-info", "");
            router.push("/unauthorized");
          } else {
            const message = response?.error
              ? response.error?.message
              : response?.data.message;
            this.toastMessage = message;
          }
        })
        .finally(() => (this.showSpinner = false));
    },
  },
};
</script>

<style scoped>
.form-main {
  padding: 20px;
}

.form-main-border {
  border: solid 1px;
  border-radius: 10px;
}

.form-header-custom-color {
  color: #9d1919;
}

.btn-custom-color {
  --bs-btn-color: #9d1919;
  --bs-btn-border-color: #9d1919;
  --bs-btn-hover-bg: #9d1919;
  --bs-btn-hover-border-color: #9d1919;
}

.no-side-padding {
  padding-left: 0;
  padding-right: 0;
}
</style>
