import generateRandomKey from "../Config/randomkey.js";
import UrlModel from "../Model/url.model.js";
import UrlRepository from "./url.repository.js";

export default class UrlShortner {
  constructor() {
    this.urlRepo = new UrlRepository();
  }

  // homepage
  get(req, res) {
    res.render("shortner", { shortUrl: null });
  }

  //function to handle adding new
  async postSubmit(req, res) {
    const url = req.body.url;

    if (url) {
      const key = generateRandomKey();
      const newUrl = new UrlModel(url, key);
      try {
        await this.urlRepo.add(newUrl);
        req.shortUrl = newUrl.shortUrl;
        res.render("shortner", { shortUrl: newUrl.shortUrl });
      } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
      }
    } else {
      res.render("shortner", { Error: "Url is empty", shortUrl: null });
    }
  }

  async redirectToOriginal(req, res) {
    const key = req.params.key;
    try {
      const originalLink = await this.urlRepo.getOriginalLink(key);
      res.redirect(originalLink);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  }
}
