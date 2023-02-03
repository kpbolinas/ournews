<template>
  <div
    id="dc-modal"
    class="modal fade"
    aria-hidden="true"
    aria-labelledby="dc-modal-label"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header modal-header-custom">
          <div
            id="dc-modal-label"
            class="w-100 d-flex justify-content-center modal-title h4"
          >
            DELETE COMMENT
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
            Are you sure you want to delete this comment?
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
import CommentApiService from "../services/comment";

export default {
  name: "DeleteComment",
  emits: ["modalHide", "reloadComments"],
  props: {
    id: {
      type: [Number, null],
      required: true,
    },
  },
  inject: ["displaySpinner", "displayToast"],
  methods: {
    async confirm() {
      if (!this.id) {
        this.$emit("modalHide");
        return;
      }
      this.displaySpinner(true);
      await CommentApiService.delete(this.id)
        .then((response) => {
          const { message } = response.data;
          this.displayToast(message, "text-bg-success");
          this.$emit("modalHide");
          this.$emit("reloadComments");
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
            this.displayToast(message, "text-bg-danger");
          }
        })
        .finally(() => this.displaySpinner(false));
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
