<template>
  <div
    id="md-modal"
    class="modal fade"
    aria-hidden="true"
    aria-labelledby="md-modal-label"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal-header-custom">
          <div
            id="md-modal-label"
            class="w-100 d-flex justify-content-center modal-title h4"
          >
            MAIL INFO
          </div>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body pt-0">
          <div class="row detail-header">
            <div class="col-12 fw-bold">{{ info?.subject }}</div>
            <div class="col-6 fw-bold">
              {{ info?.subject ? "OUR News" : "" }}
            </div>
            <div
              class="col-6 d-flex align-items-end justify-content-end detail-date"
            >
              {{ info?.created_at }}
            </div>
          </div>
          <div class="row p-3">{{ info?.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { watch } from "vue";
import router from "../router";
import MailApiService from "../services/mail";

export default {
  name: "MailDetail",
  emits: ["modalShow", "displaySpinner", "displayToast"],
  props: {
    id: {
      type: [Number, null],
      required: true,
    },
  },
  data() {
    return {
      info: "",
    };
  },
  methods: {
    async loadDetail() {
      if (!this.id) {
        this.$emit("modalShow", false);
        return;
      }
      this.$emit("displaySpinner", true);
      await MailApiService.detail(this.id)
        .then((response) => {
          const { data } = response.data;
          this.info = data;
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
  mounted() {
    watch(
      () => this.id,
      () => this.loadDetail()
    );
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

.detail-header {
  border: solid 0.1px #9d1919;
}

.detail-date {
  font-size: 0.8rem;
}
</style>
