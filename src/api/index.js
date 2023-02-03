import axios from "axios";

const initializeApiConfig = () => {
  // Set base url
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;

  // Set header accept application/json
  axios.defaults.headers.common["Accept"] = "application/json";

  // Set API token
  axios.defaults.headers.common["X-Api-Token"] =
    process.env.REACT_APP_API_TOKEN;

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
      const auth = JSON.parse(localStorage.getItem("auth-info")) ?? null;
      const authToken = auth?.token ? "Bearer " + auth.token : "";
      config.headers["Authorization"] = authToken;

      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
};

export { initializeApiConfig, axios };
