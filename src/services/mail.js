import axios from "axios";

export default class MailApiService {
  // List API
  static list = (page) => axios.get("/api/users/mails/" + page);

  // Delete API
  static delete = (id) => axios.delete("/api/users/mails/" + id);

  // Detail API
  static detail = (id) => axios.get("/api/users/mails/detail/" + id);
}
