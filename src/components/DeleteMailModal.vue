<template>
  <div
    id="dm-modal"
    class="modal fade"
    aria-hidden="true"
    aria-labelledby="dm-modal-label"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header modal-header-custom">
          <div
            id="dm-modal-label"
            class="w-100 d-flex justify-content-center modal-title h4"
          >
            DELETE MAIL
          </div>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="d-flex text-center">
            Are you sure you want to delete this mail?
          </div>
          <br />
          <button
            type="button"
            class="btn-custom-color btn btn-outline-danger w-100"
            @click="confirm"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";
import MailApiService from "../services/mail";

export default {
  name: "DeleteMail",
  emits: ["modalShow", "reloadMails", "displaySpinner", "displayToast"],
  props: {
    id: {
      type: [Number, null],
      required: true,
    },
  },
  methods: {
    async confirm() {
      if (!this.id) {
        this.$emit("modalShow", false);
        return;
      }
      this.$emit("displaySpinner", true);
      await MailApiService.delete(this.id)
        .then((response) => {
          const { message } = response.data;
          this.$emit("displayToast", message, "text-bg-success");
          this.$emit("modalShow", false);
          this.$emit("reloadMails");
        })
        .catch(({ response }) => {
          this.$emit("displaySpinner", false);
          if (response.status === 401) {
            localStorage.setItem("auth-info", "");
            router.push("/unauthorized");
          } else {
            const message = response?.error
              ? response.error?.message
              : response?.data.message;
            this.$emit("displayToast", message, "text-bg-danger");
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

.btn-custom-color {
  --bs-btn-color: #9d1919;
  --bs-btn-border-color: #9d1919;
  --bs-btn-hover-bg: #9d1919;
  --bs-btn-hover-border-color: #9d1919;
}
</style>
