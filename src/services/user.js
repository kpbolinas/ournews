import axios from "axios";

export default class UserApiService {
  // Login API
  static login = (requestData) => axios.post("/api/login", requestData);

  // Logout API
  static logout = (config = {}) => axios.post("/api/logout", {}, config);

  // Forgot Password API
  static forgotPassword = (requestData) =>
    axios.post("/api/forgot-password", requestData);

  // Verification API
  static verification = (requestData) =>
    axios.post("/api/verification", requestData);

  // Profile API
  static profile = () => axios.get("/api/profile");

  // Edit Info API
  static editInfo = (requestData) => axios.patch("/api/edit-info", requestData);

  // Change Password API
  static changePassword = (requestData) =>
    axios.patch("/api/change-password", requestData);

  // Register API
  static register = (requestData) => axios.post("/api/register", requestData);
}
