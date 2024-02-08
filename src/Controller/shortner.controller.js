import generateRandomKey from "../Config/randomkey.js";
import UrlModel from "../Model/url.model.js";
import UrlRepository from "./url.repository.js";

export default class UrlShortner {
  constructor() {
    this.urlRepo = new UrlRepository();
  }

  get(req, res) {
    res.render("shortner", { shortUrl: null });
  }

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

  redirectToOriginal(req, res) {}
}
