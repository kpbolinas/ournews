import axios from "axios";

class CommentApiService {
  // List API
  static list = (id, params = "") =>
    axios.get("/api/users/comments/" + id + params);
  // Remove with mail API
  static remove = (id, requestData) =>
    axios.patch("/api/reporters/comments/" + id, requestData);
}

export default CommentApiService;
