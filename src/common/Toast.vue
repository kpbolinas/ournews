<template>
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div
      id="our-toast"
      class="toast"
      :class="background"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-bs-delay="3000"
    >
      <div class="toast-header">
        <strong class="me-auto text-black">OUR News</strong>
      </div>
      <div id="our-toast-body" class="toast-body text-white">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import { watch } from "vue";
import * as bootstrap from "bootstrap";

export default {
  name: "AppToast",
  emits: ["displayToast"],
  props: {
    message: {
      type: String,
      required: true,
      default: "",
    },
    background: {
      type: String,
      default: "text-bg-danger",
    },
  },
  mounted() {
    watch(
      () => this.message,
      (message) => {
        const toastElement = document.querySelector("#our-toast");
        if (message) {
          const toast = new bootstrap.Toast(toastElement);
          toast.show();
        }
        toastElement.addEventListener("hidden.bs.toast", () =>
          this.$emit("displayToast", "", "")
        );
      },
      { immediate: true }
    );
  },
};
</script>
