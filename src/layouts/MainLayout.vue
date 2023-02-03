<template>
  <div class="container-fluid h-100">
    <div id="header-main" class="row">
      <div
        id="header-logo-container"
        class="col-2 d-flex text-center align-middle justify-content-center align-items-center"
      >
        <img
          id="header-logo"
          src="../assets/images/main/on-header.png"
          alt="OUR News"
        />
      </div>
      <div
        id="header-title"
        class="col-10 d-flex text-center align-middle justify-content-center align-items-center"
      >
        <HeaderTitle />
      </div>
    </div>
    <div class="row h-100">
      <div id="sidebar-container" class="col-2">
        <SideBar />
      </div>
      <div class="col-10">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script>
import { RouterView } from "vue-router";
import SideBar from "../common/SideBar.vue";
import HeaderTitle from "../common/Header.vue";

export default {
  name: "MainLayout",
  components: {
    RouterView,
    SideBar,
    HeaderTitle,
  },
};
</script>

<style scoped>
#header-main {
  background-color: #9d1919;
}

#header-logo-container {
  border: solid 0.1px #ffffff;
  padding: 5.5px 0;
}

#header-logo {
  margin: 10px;
  width: 80%;
}

#header-title {
  color: #fff;
  font-weight: bold;
  font-size: x-large;
}

#sidebar-container {
  background: #9d1919;
  padding: 0;
}
</style>
