import { ObjectId } from "mongodb";

export default class UrlModel {
  constructor(url, key, userId) {
    this.originalUrl = url;
    this.shortUrl = "http://localhost:3000/short/" + key;
    this.userId = new ObjectId(userId);
    this.visited = 0;
  }
}
