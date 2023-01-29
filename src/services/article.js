import axios from "axios";

class ArticleApiService {
  // Unpublished API
  static unpublished = (params = "") =>
    axios.get("/api/moderators/articles/unpublished" + params);

  // Published API
  static published = (params = "") =>
    axios.get("/api/moderators/articles/published" + params);

  // Archived API
  static archived = (params = "") =>
    axios.get("/api/moderators/articles/archived" + params);

  // Article detail API
  static detail = (id) => axios.get("/api/moderators/articles/" + id);

  // Publish article API
  static publish = (id) =>
    axios.patch("/api/moderators/articles/publish/" + id);

  // Return or revise article API
  static revise = (id, requestData) =>
    axios.patch("/api/moderators/articles/revise/" + id, requestData);

  // Archive article API
  static archive = (id) =>
    axios.patch("/api/moderators/articles/archive/" + id);

  // Unpublish article API
  static unpublish = (id) =>
    axios.patch("/api/moderators/articles/unpublish/" + id);

  // Unarchive article API
  static unarchive = (id) =>
    axios.patch("/api/moderators/articles/unarchive/" + id);
}

export default ArticleApiService;
