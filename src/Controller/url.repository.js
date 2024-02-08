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
}

export default UrlRepository;
