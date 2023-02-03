<template>
  <template v-if="showMessage">
    <div class="text-center card bg-success text-white">
      <div class="card-body">
        <div class="card-title h5">RESET PASSWORD SUCCESSFUL!</div>
        <p class="card-text">
          Your temporary password has been sent to your email.
        </p>
      </div>
    </div>
  </template>
  <div class="form-header-custom-color"><h2>VERIFICATION</h2></div>
  <form
    novalidate=""
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
        :class="{ 'is-invalid': formErrors?.email }"
        v-model="email"
      />
      <div class="invalid-feedback">{{ formErrors?.email }}</div>
    </div>
    <div class="mb-3">
      <label class="form-label" for="formGroupToken">Token</label>
      <input
        name="token"
        placeholder="Token"
        type="text"
        id="formGroupToken"
        class="form-control"
        :class="{ 'is-invalid': formErrors?.token }"
        v-model="token"
      />
      <div class="invalid-feedback">{{ formErrors?.token }}</div>
    </div>
    <div class="d-grid">
      <button type="submit" class="btn-custom-color btn btn-outline-danger">
        SUBMIT
      </button>
    </div>
  </form>
  <div class="d-flex align-items-end flex-column">
    <RouterLink class="no-side-padding btn btn-link" to="/login"
      >Back to LOGIN</RouterLink
    >
    <RouterLink class="no-side-padding btn btn-link" to="/forgot-password"
      >Forgot Password</RouterLink
    >
    <RouterLink class="no-side-padding btn btn-link" to="/register"
      >Join Us!</RouterLink
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
  name: "VerificationPage",
  components: {
    RouterLink,
    Spinner,
    Toast,
  },
  data() {
    return {
      email: "",
      token: "",
      showMessage: false,
      showSpinner: false,
      toastMessage: "",
      formErrors: null,
    };
  },
  methods: {
    async handleSubmit() {
      this.showMessage = false;
      this.formErrors = null;
      this.showSpinner = true;
      this.toastMessage = "";
      const formData = { email: this.email, token: this.token };
      await UserApiService.verification(formData)
        .then(() => {
          this.showMessage = true;
        })
        .catch(({ response }) => {
          this.showSpinner = false;
          switch (response.status) {
            case 422: {
              const result = response.data;
              const responseErrors = result.errors;
              const errorKeys = Object.keys(responseErrors);
              let formErrors = {};
              errorKeys?.forEach(
                (errorKey) =>
                  (formErrors[errorKey] = responseErrors[errorKey][0])
              );
              this.formErrors = formErrors;
              break;
            }
            case 401: {
              router.push("/unauthorized");
              break;
            }
            default: {
              const message = response?.error
                ? response.error?.message
                : response?.data.message;
              this.toastMessage = message;
              break;
            }
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
