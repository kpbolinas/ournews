import axios from "axios";

export default class CommentApiService {
  // List API
  static list = (params) => axios.get("/api/users/comments" + params);

  // Create API
  static create = (requestData) =>
    axios.post("/api/users/comments", requestData);

  // Update API
  static update = (id, requestData) =>
    axios.patch("/api/users/comments/" + id, requestData);

  // Delete API
  static delete = (id) => axios.delete("/api/users/comments/" + id);
}
