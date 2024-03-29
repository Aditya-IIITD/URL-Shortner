import { ObjectId } from "mongodb";
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
      const shortUrl = "https://url-shortner-sgpo.onrender.com/bit/" + key;
      const result = await db
        .collection(this.collection)
        .findOne({ shortUrl: shortUrl });
      return result.originalUrl;
    } catch (err) {
      console.log(err, "something went wrong with DB");
    }
  }

  async getUserUrls(userId) {
    try {
      const db = getDB();
      const result = await db
        .collection(this.collection)
        .find({ userId: new ObjectId(userId) })
        .toArray();
      return result;
    } catch (err) {
      console.log(err, "something went wrong with DB");
    }
  }

  async checkIfUrlExist(originalUrl, userId) {
    try {
      const db = getDB();
      const result = await db
        .collection(this.collection)
        .findOne({ userId: new ObjectId(userId), originalUrl: originalUrl });
      return result;
    } catch (err) {
      console.log(err, "something went wrong with DB");
    }
  }

  async delete(id, userId) {
    try {
      const db = getDB();
      const result = await db
        .collection(this.collection)
        .deleteOne({ userId: userId, _id: new ObjectId(id) });
    } catch (err) {
      console.log(err, "something went wrong with DB");
    }
  }

  async update(id, userId, newUrl) {
    try {
      const db = getDB();
      const result = await db
        .collection(this.collection)
        .updateOne(
          { userId: userId, _id: new ObjectId(id) },
          { $set: { originalUrl: newUrl, visited: 0 } }
        );
    } catch (err) {
      console.log(err, "something went wrong with DB");
    }
  }

  async increaseVisit(key) {
    try {
      const db = getDB();
      const result = await db.collection(this.collection).updateOne(
        {
          shortUrl: "https://url-shortner-sgpo.onrender.com/bit/" + key,
        },
        { $inc: { visited: 1 } }
      );
    } catch (err) {
      console.log(err, "something went wrong with DB");
    }
  }
}

export default UrlRepository;
