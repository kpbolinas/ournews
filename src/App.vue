<template>
  <RouterView />
</template>

<script>
import { RouterView } from "vue-router";
import { initializeApiConfig, setCookie } from "./services/api.js";

export default {
  name: "App",
  components: {
    RouterView,
  },
  beforeCreate() {
    initializeApiConfig();
  },
  created() {
    setCookie();
  },
};
</script>
