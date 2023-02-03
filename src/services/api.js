import axios from "axios";
import router from "../router";

const initializeApiConfig = () => {
  // Set base url
  axios.defaults.baseURL = "http://localhost:8000";

  // Set header accept application/json
  axios.defaults.headers.common["Accept"] = "application/json";

  // Set API token
  axios.defaults.headers.common["X-Api-Token"] =
    "aaae90c372bdefbae6471d43329de02501ddb4e929a73fd6dd15517e7f54610e";

  // Set POST content type to application/x-www-form-urlencoded
  axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";

  // Set PATCH content type to application/x-www-form-urlencoded
  axios.defaults.headers.patch["Content-Type"] =
    "application/x-www-form-urlencoded";

  axios.defaults.withCredentials = true;

  axios.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      const authStorage = localStorage.getItem("auth-info");
      if (authStorage) {
        const auth = JSON.parse(authStorage) ?? null;
        const authToken = auth?.token ? "Bearer " + auth.token : "";
        config.headers["Authorization"] = authToken;
      }

      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
};

// Set csrf token
const setCookie = () =>
  axios
    .get("/sanctum/csrf-cookie")
    .then(() => {})
    .catch(({ response }) => {
      const status = response.status;
      const message = response?.data.message;
      // Check if unauthorized (No API Token)
      if (status === 401) {
        localStorage.setItem("auth-info", null);
        // Set unauthorize page
        router.push("/unauthorized");
      } else {
        console.log(message);
      }
    });

export { initializeApiConfig, setCookie };
