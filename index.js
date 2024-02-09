import express from "express";
import UrlShortner from "./src/Controller/shortner.controller.js";
import path from "path";
import ejsLayouts from "express-ejs-layouts";
import { connectToMongodb } from "./src/Config/mongodb.js";
import cors from "cors";
import UserController from "./src/Controller/user.controller.js";
import auth from "./src/Middlewares/auth.middleware.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import validationMiddleware from "./src/Middlewares/validator.middleware.js";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(
  session({
    saveUninitialized: true,
    resave: false,
    cookie: { secure: false },
    secret: "0923ybmuiduz2vsA9grLZn2aNyjGoefe",
  })
);
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src", "View"));

app.use(ejsLayouts);
app.use(express.urlencoded({ extended: true }));

const urlshortner = new UrlShortner();
const usercontroller = new UserController();
app.get("/", (req, res) => urlshortner.get(req, res));
app.get("/short/:key", auth, (req, res) =>
  urlshortner.redirectToOriginal(req, res)
);
app.get("/Signin", usercontroller.getSignin);
app.get("/Signup", usercontroller.getSignup);
app.get("/Signout", usercontroller.signOut);
app.post("/Submiturl", auth, (req, res) => urlshortner.postSubmit(req, res));
app.post("/Signup", validationMiddleware, (req, res) =>
  usercontroller.postSignup(req, res)
);
app.post("/Signin", (req, res) => usercontroller.postSignin(req, res));
app.post("/deleteUrl/:id", auth, (req, res) => urlshortner.deleteUrl(req, res));
app.post("/updateUrl/:id", auth, (req, res) => urlshortner.updateUrl(req, res));

app.use(express.static("src/View"));

app.listen(3000, () => {
  console.log("App is listening at 3000...");
  connectToMongodb();
});
