<template>
  {{ title }}
</template>

<script>
import { useRoute } from "vue-router";
import { watch } from "vue";

export default {
  name: "HeaderTitle",
  components: {},
  data() {
    return {
      title: "OUR News",
      currentRoute: useRoute(),
    };
  },

  created() {
    this.title = this.currentRoute.path.replace("/", "").toUpperCase();
  },

  mounted() {
    watch(
      () => this.currentRoute.path,
      async (path) => {
        this.title = path.replace("/", "").toUpperCase();
      }
    );
  },
};
</script>
