export default function authGuard(to, next) {
  const authStorage = localStorage.getItem("auth-info");
  const authUser = authStorage ? JSON.parse(authStorage) : null;
  if (to.meta.requiresAuth) {
    if (!authUser || !authUser.token) {
      next({ path: "/login" });
    }
  } else {
    if (authUser && authUser.token) {
      next({ path: "/home" });
    }
  }

  next();
}
