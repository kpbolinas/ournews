<template>
  <div id="spinner-container" :class="{ 'display-none': !show }">
    <div id="spinner-wrapper">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppSpinner",
  props: {
    show: Boolean,
  },
};
</script>

<style scoped>
#spinner-container {
  z-index: 1100;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #10101080;
}

#spinner-wrapper {
  z-index: 100;
  position: absolute;
  top: 50%;
  left: 50%;
}

.display-none {
  display: none;
}
</style>
