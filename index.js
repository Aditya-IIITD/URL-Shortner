import express from "express";
import UrlShortner from "./src/Controller/shortner.controller.js";
import path from "path";
import ejsLayouts from "express-ejs-layouts";
import { connectToMongodb } from "./src/Config/mongodb.js";
import cors from "cors";
const app = express();

app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src", "View"));

app.use(ejsLayouts);
app.use(express.urlencoded({ extended: true }));

const urlshortner = new UrlShortner();
app.get("/", urlshortner.get);
app.get("/short/:key", (req, res) => urlshortner.redirectToOriginal(req, res));
app.post("/submiturl", (req, res) => urlshortner.postSubmit(req, res));

app.use(express.static("src/View"));

app.listen(3000, () => {
  console.log("App is listening at 3000...");
  connectToMongodb();
});
