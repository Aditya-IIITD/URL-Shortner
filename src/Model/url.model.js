export default class UrlModel {
  constructor(url, key) {
    this.originalUrl = url;
    this.shortUrl = "http://localhost:3000/short/" + key;
  }
}
