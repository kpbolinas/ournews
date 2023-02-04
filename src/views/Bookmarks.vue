<template>
  <div class="row filter-form-container">
    <div
      class="col-1 d-flex justify-content-center align-items-center filter-form-label"
    >
      FILTER :
    </div>
    <div class="col-11">
      <div class="row">
        <div class="col">
          <div>
            <select
              name="order"
              class="form-select"
              :value="order"
              @input="(event) => setOrder(event.target.value)"
            >
              <option value="1">Latest</option>
              <option value="2">Oldest</option>
            </select>
          </div>
        </div>
        <div class="col"></div>
      </div>
    </div>
  </div>
  <div class="row" v-if="!articles.length">
    <div class="d-flex justify-content-center align-items-center">
      No record(s) found.
    </div>
  </div>
  <!-- Articles -->
  <template v-if="articles.length">
    <div
      v-if="lastPage && articles.length > 3"
      class="row loader d-flex justify-content-center align-items-center fw-bold"
      @click="setPage(1)"
    >
      RESET
    </div>
    <div
      class="row bordered article-container"
      v-for="article in articles"
      :key="article.id"
      @click="(event) => showArticleDetailModal(event, article.id)"
    >
      <div class="col-9 p-0">
        <div
          class="bordered article-header fs-2 d-flex justify-content-center align-items-center"
        >
          <div class="m-1 text-truncate">{{ article.title }}</div>
        </div>
        <div
          class="bordered article-content d-flex justify-content-center align-items-center"
        >
          <div class="m-2">{{ article.content }}</div>
        </div>
        <div class="row bordered article-footer m-0">
          <div class="col-6">
            <div>
              <span class="fw-bold">Date : </span
              ><span>{{ article.published_date }}</span>
            </div>
            <div>
              <span class="fw-bold">Reporter : </span
              ><span>{{ article.reporter_name }}</span>
            </div>
          </div>
          <div class="col-6 d-flex align-items-center justify-content-end">
            <span class="article-action"
              >{{ article.comments_count }} Comments</span
            >
            <span>
              <a
                class="btn btn-link btn-act article-action"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                :data-bs-title="article.bookmark_id ? 'Unbookmark' : 'Bookmark'"
                @click="setBookmark(article.bookmark_id, article.id)"
              >
                <img
                  class="btn-act"
                  :src="
                    article.bookmark_id
                      ? '/src/assets/icons/bookmark-star-fill.svg'
                      : '/src/assets/icons/bookmark-star.svg'
                  "
                  alt="Bookmark"
                />
              </a>
            </span>
            <span>
              <a
                class="btn btn-link btn-act article-action"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                :data-bs-title="article.favorite_id ? 'Unfavorite' : 'Favorite'"
                @click="setFavorite(article.favorite_id, article.id)"
              >
                <img
                  class="btn-act"
                  :src="
                    article.favorite_id
                      ? '/src/assets/icons/heart-fill.svg'
                      : '/src/assets/icons/heart.svg'
                  "
                  alt="Favorite"
                />
              </a>
            </span>
          </div>
        </div>
      </div>
      <div class="col-3 bordered">
        <img
          class="img-fluid"
          src="../assets/images/main/default-article.png"
          alt="Default Article"
        />
      </div>
    </div>
    <div
      v-if="!lastPage"
      class="row loader d-flex justify-content-center align-items-center fw-bold"
      @click="setPage(page + 1)"
    >
      LOAD MORE
    </div>
  </template>
  <ArticleDetailModal
    :id="selectedArticle"
    @modalHide="hideArticleDetailModal"
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
import BookmarkApiService from "../services/bookmark";
import FavoriteApiService from "../services/favorite";
import ArticleDetailModal from "../components/ArticleDetailModal.vue";
import Spinner from "../common/Spinner.vue";
import Toast from "../common/Toast.vue";
import Tooltip from "../common/tooltip";
import Modal from "../components/modal";

export default {
  name: "BookmarksPage",
  components: {
    ArticleDetailModal,
    Spinner,
    Toast,
  },
  data() {
    return {
      page: 1,
      order: 1,
      articles: [],
      lastPage: true,
      showSpinner: false,
      toastType: "",
      toastMessage: "",
      selectedArticle: null,
      adModal: null,
    };
  },
  provide() {
    return {
      reloadArticles: this.loadArticles,
      displaySpinner: this.displaySpinner,
      displayToast: this.displayToast,
      resetTooltip: this.resetTooltip,
    };
  },
  methods: {
    async loadArticles() {
      this.showSpinner = true;
      let params = `/${this.page}/${this.order}`;
      await BookmarkApiService.list(params)
        .then((response) => {
          const { articles, last_page } = response.data.data;
          this.articles = articles;
          this.lastPage = last_page === 1;
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
    setBookmark(id, articleId) {
      if (id) {
        this.deleteBookmark(id);
      } else {
        this.createBookmark(articleId);
      }
    },
    setFavorite(id, articleId) {
      if (id) {
        this.deleteFavorite(id);
      } else {
        this.createFavorite(articleId);
      }
    },
    async createBookmark(articleId) {
      this.showSpinner = true;
      this.toastType = "";
      this.toastMessage = "";
      const formData = { article_id: articleId };
      await BookmarkApiService.create(formData)
        .then((response) => {
          this.toastType = "text-bg-success";
          this.toastMessage = response.data.message;
          this.loadArticles();
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
            this.toastType = "text-bg-danger";
            this.toastMessage = message;
          }
        })
        .finally(() => (this.showSpinner = false));
    },
    async deleteBookmark(id) {
      this.showSpinner = true;
      this.toastType = "";
      this.toastMessage = "";
      await BookmarkApiService.delete(id)
        .then((response) => {
          this.toastType = "text-bg-success";
          this.toastMessage = response.data.message;
          this.loadArticles();
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
            this.toastType = "text-bg-danger";
            this.toastMessage = message;
          }
        })
        .finally(() => (this.showSpinner = false));
    },
    async createFavorite(articleId) {
      this.showSpinner = true;
      this.toastType = "";
      this.toastMessage = "";
      const formData = { article_id: articleId };
      await FavoriteApiService.create(formData)
        .then((response) => {
          this.toastType = "text-bg-success";
          this.toastMessage = response.data.message;
          this.loadArticles();
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
            this.toastType = "text-bg-danger";
            this.toastMessage = message;
          }
        })
        .finally(() => (this.showSpinner = false));
    },
    async deleteFavorite(id) {
      this.showSpinner = true;
      this.toastType = "";
      this.toastMessage = "";
      await FavoriteApiService.delete(id)
        .then((response) => {
          this.toastType = "text-bg-success";
          this.toastMessage = response.data.message;
          this.loadArticles();
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
            this.toastType = "text-bg-danger";
            this.toastMessage = message;
          }
        })
        .finally(() => (this.showSpinner = false));
    },
    showArticleDetailModal(event, id) {
      const classList = event.target.classList;
      if (classList.contains("btn-act")) {
        return;
      }
      this.selectedArticle = id;
      this.adModal.dialog.show();
    },
    hideArticleDetailModal() {
      this.adModal.dialog.hide();
    },
    displaySpinner(value) {
      this.showSpinner = value;
    },
    displayToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
    },
    setPage(value) {
      this.page = value;
      this.loadArticles();
    },
    setOrder(value) {
      this.order = value;
      this.loadArticles();
    },
    async resetTooltip() {
      await Tooltip.dispose();
      await Tooltip.init();
    },
  },
  created() {
    this.loadArticles();
  },
  mounted() {
    this.adModal = Modal.set("#ad-modal");
    Modal.onHidden(this.adModal.element, () => (this.selectedArticle = null));
  },
  updated() {
    setTimeout(() => this.resetTooltip(), 1);
  },
};
</script>

<style scoped>
.filter-form-container {
  margin-top: 10px;
  margin-bottom: 10px;
}

.filter-form-label {
  font-weight: bold;
}

.bordered {
  border: solid 1px #9d1919;
}

.article-container {
  cursor: pointer;
}

.article-header {
  height: 25%;
}

.article-content {
  height: 55%;
}

.article-footer {
  height: 20%;
}

.article-footer span {
  font-size: 0.8rem;
}

.article-action {
  padding: 0 2px;
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
