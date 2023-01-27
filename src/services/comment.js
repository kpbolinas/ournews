import axios from "axios";

class CommentApiService {
  // List API
  static list = (params = "") => axios.get("/api/users/comments" + params);

  // Remove with mail API
  static remove = (id, requestData) =>
    axios.patch("/api/reporters/comments/" + id, requestData);
}

export default CommentApiService;
