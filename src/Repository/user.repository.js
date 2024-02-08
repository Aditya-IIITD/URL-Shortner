import { getDB } from "../Config/mongodb.js";

class UserRepository {
  constructor() {
    this.collection = "Users";
  }

  async addUser(newUser) {
    try {
      const db = getDB();
      const res = await db.collection(this.collection).insertOne(newUser);
      return res;
    } catch (err) {
      console.log(err, "Something went wrong with DB");
    }
  }

  async findUser(email, password) {
    try {
      const db = getDB();
      const res = await db
        .collection(this.collection)
        .findOne({ email: email, password: password });
      return res;
    } catch (err) {
      console.log(err, "Something went wrong with DB");
    }
  }
}

export default UserRepository;
