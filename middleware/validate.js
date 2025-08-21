import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // only return msg and path
    const formattedErrors = errors.array().map((err) => ({
      msg: err.msg,
      path: err.path,
    }));

    return res.status(400).json({ errors: formattedErrors });
  }
  next();
};
