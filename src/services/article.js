import axios from "axios";

export default class ArticleApiService {
  // List API
  static list = (params) => axios.get("/api/users/articles" + params);
}
