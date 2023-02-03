import axios from "axios";

export default class BookmarkApiService {
  // List API
  static list = (params) => axios.get("/api/users/bookmarks" + params);

  // Create API
  static create = (requestData) =>
    axios.post("/api/users/bookmarks", requestData);

  // Delete API
  static delete = (id) => axios.delete("/api/users/bookmarks/" + id);
}
