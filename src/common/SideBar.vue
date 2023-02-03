<template>
  <div class="flex-column nav nav-pills nav-justified" id="sidebar">
    <RouterLink class="nav-link" to="/home">Home</RouterLink>
    <RouterLink class="nav-link" to="/bookmarks">Bookmarks</RouterLink>
    <RouterLink class="nav-link" to="/favorites">Favorites</RouterLink>
    <RouterLink class="nav-link" to="/profile">Profile</RouterLink>
    <RouterLink class="nav-link" to="/logout">Logout</RouterLink>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";

export default {
  name: "SideBar",
  components: {
    RouterLink,
  },
};
</script>

<style scoped>
#sidebar > .nav-link {
  color: #ffffff;
  border: solid 0.1px #fff;
  border-radius: 0;
}

#sidebar a.router-link-exact-active {
  color: #9d1919;
  background-color: #ffffff;
  border-bottom-right-radius: 100px;
  border-top-left-radius: 100px;
}
</style>
