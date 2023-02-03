<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <div
        class="col d-flex text-center align-middle justify-content-center align-items-center"
      >
        <div>
          <img src="../assets/images/guest/on.png" alt="OUR News" />
        </div>
      </div>
      <div
        class="col d-flex align-middle justify-content-center align-items-center"
      >
        <div class="w-50">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterView } from "vue-router";

export default {
  name: "GuestLayout",
  components: {
    RouterView,
  },
};
</script>
