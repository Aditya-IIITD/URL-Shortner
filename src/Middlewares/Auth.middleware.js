const auth = (req, res, next) => {
  if (req.session.userEmail) {
    next();
  } else {
    res.render("oops", { Error: "Haven't you registered yet?" });
  }
};

export default auth;
