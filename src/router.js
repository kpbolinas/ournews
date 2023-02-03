import { createRouter, createWebHistory } from "vue-router";
import GuestLayout from "./layouts/GuestLayout.vue";
import MainLayout from "./layouts/MainLayout.vue";
import authGuard from "./middlewares/authGuard.js";
import Login from "./views/Login.vue";
import Registration from "./views/Registration.vue";
import ForgotPassword from "./views/ForgotPassword.vue";
import Verification from "./views/Verification.vue";
import Home from "./views/Home.vue";
import Bookmarks from "./views/Bookmarks.vue";
import Favorites from "./views/Favorites.vue";
import Profile from "./views/Profile.vue";
import Logout from "./views/Logout.vue";
import NotFound from "./views/NotFound.vue";
import Unauthorized from "./views/Unauthorized.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: GuestLayout,
      children: [
        {
          path: "/login",
          name: "Login",
          component: Login,
        },
        {
          path: "/register",
          name: "Register",
          component: Registration,
        },
        {
          path: "/forgot-password",
          name: "ForgotPassword",
          component: ForgotPassword,
        },
        {
          path: "/verification",
          name: "Verification",
          component: Verification,
        },
      ],
    },
    {
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: "/home",
          name: "Home",
          component: Home,
        },
        {
          path: "/bookmarks",
          name: "Bookmarks",
          component: Bookmarks,
        },
        {
          path: "/favorites",
          name: "Favorites",
          component: Favorites,
        },
        {
          path: "/profile",
          name: "Profile",
          component: Profile,
        },
        {
          path: "/logout",
          name: "Logout",
          component: Logout,
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: { name: "NotFound" },
    },
    {
      path: "/not-found",
      name: "NotFound",
      component: NotFound,
    },
    {
      path: "/unauthorized",
      name: "Unauthorized",
      component: Unauthorized,
    },
  ],
});

router.beforeEach((to, from, next) => authGuard(to, next));

export default router;
