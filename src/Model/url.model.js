import { ObjectId } from "mongodb";

export default class UrlModel {
  constructor(url, key, userId) {
    this.originalUrl = url;
    this.shortUrl = "https://url-shortner-2hea.onrender.com/bit/" + key;
    this.userId = new ObjectId(userId);
    this.visited = 0;
  }
}
