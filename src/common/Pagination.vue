<template>
  <div
    className="d-flex text-center align-middle justify-content-center align-items-center"
    v-if="page !== 1"
  >
    <ul class="pagination">
      <!-- Disabled -->
      <li class="page-item disabled" v-if="page <= 1">
        <span class="page-link">
          <span aria-hidden="true">&laquo;</span>
          <span class="visually-hidden">First</span>
        </span>
      </li>
      <li class="page-item disabled" v-if="page <= 1">
        <span class="page-link">
          <span aria-hidden="true">&lsaquo;</span>
          <span class="visually-hidden">Previous</span>
        </span>
      </li>
      <!-- Enabled -->
      <li class="page-item" v-if="page > 1">
        <a class="page-link" href="#" @click="setPage(1)">
          <span aria-hidden="true">&laquo;</span>
          <span class="visually-hidden">First</span>
        </a>
      </li>
      <li class="page-item" v-if="page > 1">
        <a class="page-link" href="#" @click="setPage(page - 1)">
          <span aria-hidden="true">&lsaquo;</span>
          <span class="visually-hidden">Previous</span>
        </a>
      </li>
      <!-- Previous Pages -->
      <li class="page-item" v-for="page in previousPages" :key="page.index">
        <a class="page-link" href="#" @click="setPage(page)">{{ page }}</a>
      </li>
      <!-- Current Page -->
      <li class="page-item active">
        <span class="page-link"
          >{{ page }}<span class="visually-hidden">(current)</span>
        </span>
      </li>
      <!-- Next Pages -->
      <li class="page-item" v-for="page in nextPages" :key="page.index">
        <a class="page-link" href="#" @click="setPage(page)">{{ page }}</a>
      </li>
      <!-- Enabled -->
      <li class="page-item" v-if="page < lastPage">
        <a class="page-link" href="#" @click="setPage(page + 1)">
          <span aria-hidden="true">&rsaquo;</span>
          <span class="visually-hidden">Next</span>
        </a>
      </li>
      <li class="page-item" v-if="page < lastPage">
        <a class="page-link" href="#" @click="setPage(lastPage)">
          <span aria-hidden="true">&raquo;</span>
          <span class="visually-hidden">Last</span>
        </a>
      </li>
      <!-- Disabled -->
      <li class="page-item disabled" v-if="page === lastPage">
        <span class="page-link">
          <span aria-hidden="true">&rsaquo;</span>
          <span class="visually-hidden">Next</span>
        </span>
      </li>
      <li class="page-item disabled" v-if="page === lastPage">
        <span class="page-link">
          <span aria-hidden="true">&raquo;</span>
          <span class="visually-hidden">Last</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { watch } from "vue";

export default {
  name: "AppPagination",
  emits: ["setPage"],
  props: {
    page: Number,
    lastPage: Number,
  },
  data() {
    return {
      previousPages: [],
      nextPages: [],
    };
  },
  methods: {
    setPage(page) {
      this.$emit("setPage", page);
    },
    setPreviousPages() {
      this.previousPages = [];
      for (
        let number = this.page - 4 <= 0 ? 1 : this.page - 4;
        number < this.page;
        number++
      ) {
        this.previousPages.push(number);
      }
    },
    setNextPages() {
      this.nextPages = [];
      for (
        let number = this.page + 1;
        number <= this.page + 4 && number <= this.lastPage;
        number++
      ) {
        this.nextPages.push(number);
      }
    },
  },
  mounted() {
    watch(
      () => [this.page, this.lastPage],
      () => {
        this.setPreviousPages();
        this.setNextPages();
      }
    );
  },
};
</script>

<style scoped>
.page-item:not(.active) .page-link,
.page-item:not(.active) .page-link:hover {
  color: #9d1919;
}

.page-item.active .page-link {
  background-color: #9d1919;
  border-color: #9d1919;
}

.page-item.disabled .page-link {
  color: #6c757d;
}
</style>
