<template>
  <div
    id="ad-modal"
    class="modal fade"
    aria-hidden="true"
    aria-labelledby="ad-modal-label"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header modal-header-custom">
          <div
            id="ad-modal-label"
            class="w-100 d-flex justify-content-center modal-title h4"
          >
            {{ article?.title ?? "" }}
          </div>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-3">
              <img
                class="img-fluid"
                src="/src/assets/images/main/default-article.png"
                alt="Default Article"
              />
            </div>
            <div class="col-9">
              <div>
                <div class="mb-3 article-content">
                  <textarea
                    rows="5"
                    name="content"
                    disabled="disabled"
                    class="form-control"
                    :value="article?.content ?? ''"
                  ></textarea>
                </div>
              </div>
              <div class="article-date">
                <span>Date:</span> {{ article?.published_date ?? "" }}
              </div>
              <div class="article-reporter">
                <span>Reporter:</span> {{ article?.reporter_name ?? "" }}
              </div>
            </div>
          </div>
          <div v-if="!comments.length" class="row">
            <div
              class="d-flex text-center align-middle justify-content-center align-items-center"
            >
              No comment(s) found.
            </div>
          </div>
          <div v-if="comments.length" class="row comment-section">
            <div
              v-if="lastPage && comments.length > 3"
              class="row loader d-flex justify-content-center align-items-center fw-bold m-0 mb-1"
              @click="setPage(1)"
            >
              RESET
            </div>
            <div class="comment-section-scrollable">
              <div
                class="row comment-row"
                v-for="comment in comments"
                :key="comment.id"
                :class="{
                  'highlight-row': comment.id === selectedDeleteComment,
                }"
              >
                <div class="col-4">
                  <div class="row comment-owner-detail">
                    <div
                      class="col-3 d-flex justify-content-center align-items-center"
                    >
                      <span>
                        <img
                          class="img-fluid"
                          src="/src/assets/images/main/default-profile-comment.png"
                          alt="Default Profile"
                        />
                      </span>
                    </div>
                    <div class="col-9">
                      <div class="comment-date">
                        <span>Date : </span>{{ comment?.created_at }}
                      </div>
                      <div class="comment-owner">
                        {{ comment?.first_name ?? "" }}
                        {{ comment?.last_name ?? "" }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-8 comment-content-container">
                  <div v-if="selectedEditComment !== comment?.id" class="h-100">
                    <div class="comment-content">
                      {{ comment?.content ?? "" }}
                    </div>
                    <span class="btn-actions" v-if="comment?.is_owned">
                      <a
                        class="btn btn-link comment-action"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-title="Edit"
                        @click="showEditComment(comment?.id, comment?.content)"
                      >
                        <img
                          src="/src/assets/icons/pencil-fill.svg"
                          alt="Edit"
                        />
                      </a>
                      <a
                        class="btn btn-link comment-action"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-title="Delete"
                        @click="showDeleteCommentModal(comment?.id)"
                      >
                        <img
                          src="/src/assets/icons/trash-fill.svg"
                          alt="Delete"
                        />
                      </a>
                    </span>
                  </div>
                  <div v-if="selectedEditComment === comment?.id" class="h-100">
                    <form
                      novalidate
                      class="form-main"
                      @submit.prevent="updateComment"
                    >
                      <div class="row m-0">
                        <div class="col-10 p-1">
                          <textarea
                            name="content"
                            placeholder="Write your comment update here!"
                            class="form-control comment-update-content"
                            :class="{ 'is-invalid': updateFormErrors?.content }"
                            v-model="updateContent"
                          ></textarea>
                          <div class="invalid-feedback">
                            {{ updateFormErrors?.content }}
                          </div>
                        </div>
                        <div
                          class="col-2 p-1 d-flex justify-content-center align-items-center"
                        >
                          <button
                            type="submit"
                            class="btn-custom-color btn btn-outline-danger comment-action comment-update-send"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            data-bs-title="Save"
                          >
                            <img
                              class="img-fluid"
                              src="/src/assets/images/main/send.png"
                              alt="Send"
                            />
                          </button>
                          <a
                            class="btn btn-link comment-action comment-update-cancel"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            data-bs-title="Cancel"
                            @click="hideEditComment()"
                          >
                            <img
                              src="/src/assets/icons/x-square-fill.svg"
                              alt="Cancel"
                            />
                          </a>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="!lastPage"
              class="row loader d-flex justify-content-center align-items-center fw-bold m-0 mb-1"
              @click="setPage(page + 1)"
            >
              LOAD MORE
            </div>
          </div>
          <div>
            <form novalidate class="form-main" @submit.prevent="createComment">
              <div class="row m-0">
                <div class="col-11 p-1">
                  <textarea
                    name="content"
                    placeholder="Write your comment here!"
                    class="form-control comment-create-content"
                    :class="{ 'is-invalid': createFormErrors?.content }"
                    v-model="content"
                  ></textarea>
                  <div class="invalid-feedback">
                    {{ createFormErrors?.content }}
                  </div>
                </div>
                <div
                  class="col-1 p-1 d-flex justify-content-center align-items-start"
                >
                  <button
                    type="submit"
                    class="btn-custom-color btn btn-outline-danger p-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Save"
                  >
                    <img
                      class="img-fluid"
                      src="/src/assets/images/main/send.png"
                      alt="Send"
                    />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <DeleteCommentModal
    :id="selectedDeleteComment"
    @modalHide="hideDeleteCommentModal"
    @reloadComments="loadDetail"
  />
</template>

<script>
import { watch } from "vue";
import router from "../router";
import CommentApiService from "../services/comment";
import DeleteCommentModal from "./DeleteCommentModal.vue";
import Modal from "./modal";

export default {
  name: "ArticleDetail",
  components: {
    DeleteCommentModal,
  },
  emits: ["modalHide", "displaySpinner", "displayToast"],
  props: {
    id: {
      type: [Number, null],
      required: true,
    },
  },
  inject: ["reloadArticles", "resetTooltip"],
  data() {
    return {
      article: [],
      comments: [],
      page: 1,
      lastPage: true,
      content: "",
      updateContent: "",
      createFormErrors: null,
      updateFormErrors: null,
      selectedEditComment: null,
      selectedDeleteComment: null,
      dcModal: null,
    };
  },
  methods: {
    async loadDetail() {
      if (!this.id) {
        this.$emit("modalHide");
        return;
      }
      this.$emit("displaySpinner", true);
      const params = `/${this.id}/${this.page}`;
      await CommentApiService.list(params)
        .then((response) => {
          const { article, comments, last_page } = response.data.data;
          this.article = article;
          this.comments = comments;
          this.lastPage = last_page === 1;
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
    async createComment() {
      this.createFormErrors = null;
      this.$emit("displaySpinner", true);
      const formData = {
        article_id: this.id,
        content: this.content,
      };
      await CommentApiService.create(formData)
        .then((response) => {
          const { message } = response.data;
          this.$emit("displayToast", message, "text-bg-success");
          this.content = "";
          this.loadDetail();
          this.reloadArticles();
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
              this.createFormErrors = formErrors;
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
    async updateComment() {
      this.updateFormErrors = null;
      this.$emit("displaySpinner", true);
      const formData = { content: this.updateContent };
      await CommentApiService.update(this.selectedEditComment, formData)
        .then((response) => {
          const { message } = response.data;
          this.$emit("displayToast", message, "text-bg-success");
          this.updateContent = "";
          this.hideEditComment();
          this.loadDetail();
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
              this.updateFormErrors = formErrors;
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
    showDeleteCommentModal(id) {
      this.selectedDeleteComment = id;
      this.dcModal.dialog.show();
    },
    hideDeleteCommentModal() {
      this.dcModal.dialog.hide();
    },
    setPage(value) {
      this.page = value;
      this.loadDetail();
    },
    showEditComment(id, content) {
      this.selectedEditComment = id;
      this.updateContent = content;
      this.resetTooltip();
    },
    hideEditComment() {
      this.selectedEditComment = null;
      this.updateContent = null;
      this.resetTooltip();
    },
  },
  mounted() {
    watch(
      () => this.id,
      () => this.loadDetail()
    );
    this.dcModal = Modal.set("#dc-modal");
    Modal.onHidden(
      this.dcModal.element,
      () => (this.selectedDeleteComment = null)
    );
  },
};
</script>

<style scoped>
.modal-header-custom {
  background-color: #9d1919;
  color: #ffffff;
}

.modal-header-custom {
  background-color: #9d1919;
  color: #ffffff;
}

textarea {
  resize: none;
}

.article-content textarea {
  background-color: #ffffff !important;
  border: 0 !important;
  padding: 0 !important;
}

.article-date,
.article-reporter {
  font-size: x-small;
}

.article-date span,
.article-reporter span {
  font-weight: bold;
}

.comment-section {
  border-top: solid 0.1px #9d1919;
  border-bottom: solid 0.1px #9d1919;
  overflow: hidden;
}

.comment-section-scrollable {
  max-height: 220px;
  overflow-y: scroll;
}

.comment-row {
  margin: 0;
}

.comment-owner-detail {
  border: solid 0.1px #9d1919;
  border-radius: 10px;
  margin-top: 3px;
  margin-bottom: 3px;
}

.comment-date,
.comment-owner {
  font-size: smaller;
}

.comment-date span {
  font-weight: bold;
}

.comment-content-container {
  position: relative;
  padding-right: 0;
}

.comment-content {
  border: solid 0.1px #9d1919;
  height: 90%;
  margin-top: 3px;
  margin-bottom: 3px;
  padding-left: 3px;
  padding-right: 3px;
}

.btn-actions {
  position: absolute;
  top: 0;
  right: 0;
}
.comment-action {
  padding: 0 1px;
}

.comment-update-send {
  width: 32px;
  height: 32px;
  margin-top: 0.5px;
}

.comment-update-cancel {
  width: 35px;
  height: 35px;
}

.comment-update-cancel img {
  width: 100%;
  height: 100%;
}

.btn-custom-color {
  --bs-btn-color: #9d1919;
  --bs-btn-border-color: #9d1919;
  --bs-btn-hover-bg: #9d1919;
  --bs-btn-hover-border-color: #9d1919;
}

.comment-create-content {
  height: 3.5em;
}

.comment-update-content {
  height: 2.5em;
}

.highlight-row {
  background-color: #808080;
}

.loader {
  border: solid 1px #9d1919;
  background-color: #9d1919;
  color: #ffffff;
  cursor: pointer;
}

.loader:hover {
  background-color: #cccccc;
  color: #9d1919;
}
</style>
