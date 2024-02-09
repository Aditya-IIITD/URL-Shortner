import { ObjectId } from "mongodb";
import generateRandomKey from "../Config/randomkey.js";
import UrlModel from "../Model/url.model.js";
import UrlRepository from "../Repository/url.repository.js";

export default class UrlShortner {
  constructor() {
    this.urlRepo = new UrlRepository();
  }

  // homepage
  async get(req, res) {
    if (req.session.userEmail) {
      try {
        req.userData = await this.urlRepo.getUserUrls(req.cookies.uid);
      } catch (err) {
        res.render("oops", { Error: "Something went wrong" });
      }
    }
    res.render("shortner", {
      shortUrl: null,
      userEmail: req.session.userEmail,
      links: req.userData,
    });
  }

  //function to handle adding new
  async postSubmit(req, res) {
    const url = req.body.url;
    if (url) {
      const key = generateRandomKey();
      const newUrl = new UrlModel(url, key, req.cookies.uid);
      try {
        //check if url already exist
        let user = await this.urlRepo.checkIfUrlExist(url, req.cookies.uid);
        // if not exist than add it to db
        if (!user) {
          await this.urlRepo.add(newUrl);
        } else {
          newUrl.shortUrl = user.shortUrl;
        }
        const userData = await this.urlRepo.getUserUrls(req.cookies.uid);
        req.shortUrl = newUrl.shortUrl;
        res.render("shortner", {
          shortUrl: newUrl.shortUrl,
          userEmail: req.session.userEmail,
          links: userData,
        });
      } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
      }
    } else {
      const userData = await this.urlRepo.getUserUrls(req.cookies.uid);
      res.render("shortner", {
        Error: "Url is empty",
        shortUrl: null,
        userEmail: req.session.userEmail,
        links: userData,
      });
    }
  }

  async redirectToOriginal(req, res) {
    const key = req.params.key;
    try {
      const originalLink = await this.urlRepo.getOriginalLink(key);
      await this.urlRepo.increaseVisit(key, req.cookies.uid);
      res.redirect(originalLink);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  }

  async deleteUrl(req, res) {
    const id = req.params.id;
    const userId = new ObjectId(req.cookies.uid);
    try {
      await this.urlRepo.delete(id, userId);
      // res.redirect("/");
      const userData = await this.urlRepo.getUserUrls(req.cookies.uid);
        res.render("shortner", {
          shortUrl: null,
          userEmail: req.session.userEmail,
          links: userData,
        });
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  }

  async updateUrl(req, res) {
    const id = req.params.id;
    const userId = new ObjectId(req.cookies.uid);
    const newUrl = req.body.newUrl;
    try {
      if (newUrl) {
        await this.urlRepo.update(id, userId, newUrl);
        res.redirect("/");
      } else {
        const userData = await this.urlRepo.getUserUrls(req.cookies.uid);
        res.render("shortner", {
          Error: "New Url is invalid",
          shortUrl: null,
          userEmail: req.session.userEmail,
          links: userData,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  }
}
