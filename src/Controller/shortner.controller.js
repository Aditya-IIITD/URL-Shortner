import generateRandomKey from "../Config/randomkey.js";

export default class UrlShortner {
  get(req, res) {
    res.render("shortner");
  }

  postSubmit(req, res) {
    const url = req.body.url;
    console.log(url);

    const key = generateRandomKey();
    console.log(key);
    res.send("submitted");
  }
}
