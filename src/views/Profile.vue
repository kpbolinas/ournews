<template>
  <div class="row profile-wrapper">
    <div
      class="col-4 d-flex text-center align-middle justify-content-center align-items-center"
    >
      <img
        src="../assets/images/main/default-profile.png"
        alt="Default Profile"
      />
    </div>
    <div class="col-8 d-flex align-middle align-items-center">
      <div class="row w-100 info-wrapper">
        <div>
          <span class="info-label">Email: </span><span>{{ info?.email }}</span>
        </div>
        <div>
          <span class="info-label">First Name: </span>
          <span>{{ info?.first_name }}</span>
        </div>
        <div>
          <span class="info-label">Last Name: </span>
          <span>{{ info?.last_name }}</span>
        </div>
        <div>
          <span>
            <button
              type="button"
              class="btn-custom-color btn btn-outline-danger"
              @click="displayEditInfoModal(true)"
            >
              Edit Info
            </button>
          </span>
          &nbsp;
          <span>
            <button
              type="button"
              class="btn-custom-color btn btn-outline-danger"
              @click="displayChangePassModal(true)"
            >
              Change Password
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="mail-header text-center fs-5">MAILS</div>
    <div
      class="d-flex text-center align-middle justify-content-center align-items-center"
      v-if="!mails.length"
    >
      No record(s) found.
    </div>
    <div class="table-responsive no-side-padding" v-if="mails.length">
      <table class="table table-striped table-bordered table-hover w-100">
        <tbody class="text-center">
          <tr
            v-for="mail in mails"
            :key="mail.id"
            :class="{
              'fw-bold': !mail.is_read,
              'highlight-row':
                mail.id === selectedDeleteMail ||
                mail.id === selectedDetailMail,
            }"
          >
            <td
              class="cursor-pointer w-25"
              @click="displayMailDetailModal(true, mail.is_read, mail.id)"
            >
              OUR NEWS
            </td>
            <td
              class="cursor-pointer"
              @click="displayMailDetailModal(true, mail.is_read, mail.id)"
            >
              {{ mail.subject }}
            </td>
            <td class="w-25">
              <a
                class="btn btn-link"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-title="Delete"
                @click="displayDeleteMailModal(true, mail.id)"
              >
                <img src="../assets/icons/trash-fill.svg" alt="Delete" />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <Pagination :page="page" :lastPage="lastPage" @setPage="setPage" />
  <EditInfoModal
    :info="info"
    @modalShow="displayEditInfoModal"
    @reloadProfile="loadProfile"
    @displaySpinner="displaySpinner"
    @displayToast="displayToast"
  />
  <ChangePassModal
    @modalShow="displayChangePassModal"
    @reloadProfile="loadProfile"
    @displaySpinner="displaySpinner"
    @displayToast="displayToast"
  />
  <MailDetailModal
    :id="selectedDetailMail"
    @modalShow="displayDeleteMailModal"
    @displaySpinner="displaySpinner"
    @displayToast="displayToast"
  />
  <DeleteMailModal
    :id="selectedDeleteMail"
    @modalShow="displayDeleteMailModal"
    @reloadMails="loadMails"
    @displaySpinner="displaySpinner"
    @displayToast="displayToast"
  />
  <Spinner :show="showSpinner" />
  <template v-if="toastMessage">
    <Toast
      :message="toastMessage"
      :background="toastType"
      @displayToast="displayToast"
    />
  </template>
</template>

<script>
import router from "../router";
import UserApiService from "../services/user";
import MailApiService from "../services/mail";
import Pagination from "../common/Pagination.vue";
import EditInfoModal from "../components/EditInfoModal.vue";
import ChangePassModal from "../components/ChangePassModal.vue";
import MailDetailModal from "../components/MailDetailModal.vue";
import DeleteMailModal from "../components/DeleteMailModal.vue";
import Spinner from "../common/Spinner.vue";
import Toast from "../common/Toast.vue";
import Modal from "../components/modal";
import Tooltip from "../common/tooltip";

export default {
  name: "ProfilePage",
  components: {
    Spinner,
    Toast,
    EditInfoModal,
    ChangePassModal,
    MailDetailModal,
    DeleteMailModal,
    Pagination,
  },
  data() {
    return {
      info: "",
      mails: [],
      showSpinner: false,
      toastType: "",
      toastMessage: "",
      eiModal: null,
      cpModal: null,
      dmModal: null,
      mdModal: null,
      page: 1,
      lastPage: 1,
      selectedDeleteMail: null,
      selectedDetailMail: null,
      alreadyReadMail: false,
    };
  },
  methods: {
    async loadProfile() {
      this.showSpinner = true;
      await UserApiService.profile()
        .then((response) => {
          this.info = response.data.data;
        })
        .catch(({ response }) => {
          this.showSpinner = false;
          if (response.status === 401) {
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
    async loadMails() {
      this.showSpinner = true;
      await MailApiService.list(this.page)
        .then((response) => {
          const data = response.data?.data;
          this.mails = data?.mails;
          this.lastPage = data?.last_page;
        })
        .catch(({ response }) => {
          this.showSpinner = false;
          if (response.status === 401) {
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
    displayEditInfoModal(value) {
      if (value) {
        this.eiModal.dialog.show();
      } else {
        this.eiModal.dialog.hide();
      }
    },
    displayChangePassModal(value) {
      if (value) {
        this.cpModal.dialog.show();
      } else {
        this.cpModal.dialog.hide();
      }
    },
    displayDeleteMailModal(value, id = null) {
      if (id) {
        this.selectedDeleteMail = id;
      }
      if (value) {
        this.dmModal.dialog.show();
      } else {
        this.dmModal.dialog.hide();
      }
    },
    displayMailDetailModal(value, isRead, id = null) {
      this.alreadyReadMail = isRead;
      if (id) {
        this.selectedDetailMail = id;
      }
      if (value) {
        this.mdModal.dialog.show();
      } else {
        this.mdModal.dialog.hide();
      }
    },
    displaySpinner(value) {
      this.showSpinner = value;
    },
    displayToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
    },
    setPage(page) {
      this.page = page;
      this.setParams({ page: page });
      this.loadMails();
    },
    setParams(param) {
      const mailParams = sessionStorage.getItem("mail-params");
      let params = mailParams ? JSON.parse(mailParams) : {};
      params = { page: params.page ?? 1, ...param };
      sessionStorage.setItem("mail-params", JSON.stringify(params));
    },
  },
  created() {
    const mailParams = sessionStorage.getItem("mail-params");
    let sessionParams = mailParams ? JSON.parse(mailParams) : {};
    const params = { page: sessionParams.page ?? 1 };
    sessionStorage.setItem("mail-params", JSON.stringify(params));
    this.page = params.page;
    this.loadProfile();
    this.loadMails();
  },
  mounted() {
    Tooltip.init();
    this.eiModal = Modal.set("#ei-modal");
    this.cpModal = Modal.set("#cp-modal");
    this.dmModal = Modal.set("#dm-modal");
    this.mdModal = Modal.set("#md-modal");
    Modal.onHidden(
      this.dmModal.element,
      () => (this.selectedDeleteMail = null)
    );
    Modal.onHidden(this.mdModal.element, () => {
      this.selectedDetailMail = null;
      if (!this.alreadyReadMail) {
        this.loadMails();
      }
      this.alreadyReadMail = false;
    });
  },
};
</script>

<style scoped>
.profile-wrapper {
  border: solid 0.1px #9d1919;
}

.info-wrapper > div {
  margin: 5px 0;
}

.info-label {
  font-weight: bold;
}

.btn-custom-color {
  --bs-btn-color: #9d1919;
  --bs-btn-border-color: #9d1919;
  --bs-btn-hover-bg: #9d1919;
  --bs-btn-hover-border-color: #9d1919;
}

.mail-header {
  background-color: #9d1919;
  color: #ffffff;
  font-weight: bold;
  padding: 5px 0;
}

.no-side-padding {
  padding-left: 0;
  padding-right: 0;
}

.cursor-pointer {
  cursor: pointer;
}
.highlight-row {
  background-color: #808080;
}
</style>
