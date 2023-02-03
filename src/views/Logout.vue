<template>
  <div></div>
</template>

<script>
import UserApiService from "../services/user";
import router from "../router";

export default {
  name: "LogoutPage",
  async beforeCreate() {
    await UserApiService.logout()
      .then(() => {
        localStorage.setItem("auth-info", "");
        router.push("/login");
      })
      .catch(({ response }) => {
        if (response?.status === 401) {
          localStorage.setItem("auth-info", "");
          router.push("/unauthorized");
        } else {
          const message = response.data?.message;
          console.log(message);
        }
      });
  },
};
</script>
