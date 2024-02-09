import UserModel from "../Model/user.model.js";
import UserRepository from "../Repository/user.repository.js";
import bcrypt from "bcrypt";

class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  getSignin(req, res) {
    res.render("signin", { Error: null });
  }

  async postSignin(req, res) {
    const { email, password } = req.body;
    //check if user exist
    try {
      const result = await this.userRepository.findUserWithEmail(email);
      //compare hashed password with input
      const passMatched = result
        ? await bcrypt.compare(req.body.password, result.password)
        : false;
      if (result && passMatched) {
        if (!req.cookies.uid) {
          res.cookie("uid", result._id.toString(), { maxAge: 60*60*1000 });
        }
        req.session.userEmail = email;
        res.redirect("/");
      } else {
        res.render("signin", {
          Error: "Invalid Credentials",
        });
      }
    } catch (err) {
      console.log(err);
      res.render("oops", { Error: "Something went wrong" });
    }
  }

  getSignup(req, res) {
    res.render("signup", { Error: null });
  }

  async postSignup(req, res) {
    const { name, email, password } = req.body;
    //hashing password because it will be stored in DB
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new UserModel(name, email, hashedPassword);
    try {
      //check if user already exists
      const result = await this.userRepository.findUserWithEmail(email);
      if (result) {
        res.cookie("uid", result._id.toString(), { maxAge: 60 * 1000 });
        res.render("signup", { Error: "User already exist, try to Login" });
      } else {
        const userDoc = await this.userRepository.addUser(newUser);
        res.cookie("uid", userDoc.insertedId.toString(), { maxAge: 60 * 1000 });
        res.redirect("/Signin");
      }
    } catch (err) {
      console.log(err);
      res.render("oops", { Error: "Something went wrong" });
    }
  }

  signOut(req, res) {
    res.clearCookie("uid");
    req.session.destroy();
    res.redirect("/");
  }
}

export default UserController;
