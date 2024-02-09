import { MongoClient } from "mongodb";

const url =
  "mongodb+srv://AdityaJ:obZdbtD3FKjDUx2m@urlshortner.61emkqk.mongodb.net/urlshortner?retryWrites=true&w=majority";

let client;
export const connectToMongodb = () => {
  MongoClient.connect(url)
    .then((clientInstance) => {
      client = clientInstance;
      console.log("Mongodb is connected...");
      createIndex(clientInstance.db());
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getClient = () => {
  return client;
};

export const getDB = () => {
  return client.db();
};

const createIndex = async (db) => {
  try {
    await db.collection("URLs").createIndex({ shortUrl: "text" });
    console.log("Index created..");
  } catch (err) {
    console.log(err);
  }
};
