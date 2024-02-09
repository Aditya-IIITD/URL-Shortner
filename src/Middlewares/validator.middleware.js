import { body, validationResult } from "express-validator";

const validationMiddleware = async (req, res, next) => {
  //rules
  const rules = [
    body("name").isLength({ min: 1 }).withMessage("Name is invalid"),
    body("email").isEmail().withMessage("Invalid Email Address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ];

  //run validator
  await Promise.all(rules.map((rule) => rule.run(req)));
  const validationErrors = validationResult(req);

  //check for errors
  if (!validationErrors.isEmpty()) {
    return res.render("Signup", {
      Error: validationErrors.array()[0].msg,
    });
  }
  next();
};

export default validationMiddleware;
