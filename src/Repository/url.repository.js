import { getDB } from "../Config/mongodb.js";

class UrlRepository {
  constructor() {
    this.collection = "URLs";
  }

  async add(newUrl) {
    try {
      const db = getDB();
      await db.collection(this.collection).insertOne(newUrl);
      return newUrl;
    } catch (err) {
      console.log(err, "Something went wrong with DB");
    }
  }

  async getOriginalLink(key) {
    try {
      const db = getDB();
      const shortUrl = "http://localhost:3000/short/" + key;
      const result = await db
        .collection(this.collection)
        .findOne({ shortUrl: shortUrl });
      return result.originalUrl;
    } catch (err) {
      console.log(err, "something went wrong with DB");
    }
  }
}

export default UrlRepository;
