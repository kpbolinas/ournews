import axios from "axios";

export default class FavoriteApiService {
  // List API
  static list = (params) => axios.get("/api/users/favorites" + params);

  // Create API
  static create = (requestData) =>
    axios.post("/api/users/favorites", requestData);

  // Delete API
  static delete = (id) => axios.delete("/api/users/favorites/" + id);
}
