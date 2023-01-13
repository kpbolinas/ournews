import axios from "axios";

class UserApiService {
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
  // Member list API
  static list = (params = "") => axios.get("/api/admins/members" + params);
  // Create API
  static create = (requestData) =>
    axios.post("/api/admins/members", requestData);
  // Deactivate API
  static resetPassword = (id) =>
    axios.patch("/api/admins/members/reset-password/" + id);
  // Deactivate API
  static deactivate = (id) =>
    axios.delete("/api/admins/members/deactivate/" + id);
}

export default UserApiService;
