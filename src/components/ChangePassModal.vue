<template>
  <div
    id="cp-modal"
    class="modal fade"
    aria-hidden="true"
    aria-labelledby="cp-modal-label"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal-header-custom">
          <div
            id="cp-modal-label"
            class="w-100 d-flex justify-content-center modal-title h4"
          >
            CHANGE PASSWORD
          </div>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form novalidate class="form-main" @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label" for="formGroupOldPassword">
                Old Password
              </label>
              <input
                name="password"
                placeholder="Old Password"
                type="password"
                id="formGroupOldPassword"
                class="form-control"
                :class="{ 'is-invalid': formErrors?.password }"
                v-model="password"
              />
              <div class="invalid-feedback">{{ formErrors?.password }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="formGroupNewPassword">
                New Password
              </label>
              <input
                name="new_password"
                placeholder="New Password"
                type="password"
                id="formGroupNewPassword"
                class="form-control"
                :class="{ 'is-invalid': formErrors?.new_password }"
                v-model="newPassword"
              />
              <div class="invalid-feedback">{{ formErrors?.new_password }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="formGroupConfirmNewPassword">
                Confirm New Password
              </label>
              <input
                name="confirm_new_password"
                placeholder="Confirm New Password"
                type="password"
                id="formGroupConfirmNewPassword"
                class="form-control"
                :class="{ 'is-invalid': formErrors?.confirm_new_password }"
                v-model="confirmNewPassword"
              />
              <div class="invalid-feedback">
                {{ formErrors?.confirm_new_password }}
              </div>
            </div>
            <div class="d-grid">
              <button
                type="submit"
                class="btn-custom-color btn btn-outline-danger"
              >
                SAVE
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";
import UserApiService from "../services/user";

export default {
  name: "ChangePassword",
  emits: ["modalShow", "reloadProfile", "displaySpinner", "displayToast"],
  data() {
    return {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
      formErrors: null,
    };
  },
  methods: {
    async handleSubmit() {
      this.formErrors = null;
      this.$emit("displaySpinner", true);
      const formData = {
        password: this.password,
        new_password: this.newPassword,
        confirm_new_password: this.confirmNewPassword,
      };
      await UserApiService.changePassword(formData)
        .then((response) => {
          const { message } = response.data;
          this.$emit("displayToast", message, "text-bg-success");
          this.$emit("modalShow", false);
          this.$emit("reloadProfile");
        })
        .catch(({ response }) => {
          this.$emit("displaySpinner", false);
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
              localStorage.setItem("auth-info", "");
              router.push("/unauthorized");
              break;
            }
            default: {
              const message = response?.error
                ? response.error?.message
                : response?.data.message;
              this.$emit("displayToast", message, "text-bg-danger");
              break;
            }
          }
        })
        .finally(() => this.$emit("displaySpinner", false));
    },
  },
};
</script>

<style scoped>
.modal-header-custom {
  background-color: #9d1919;
  color: #ffffff;
}

.form-main {
  padding: 20px;
}

.btn-custom-color {
  --bs-btn-color: #9d1919;
  --bs-btn-border-color: #9d1919;
  --bs-btn-hover-bg: #9d1919;
  --bs-btn-hover-border-color: #9d1919;
}
</style>
