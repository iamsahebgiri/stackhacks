const mongoose = require("mongoose");
const router = require("express").Router();
const passport = require("passport");
const validator = require("validator");
const auth = require("../../middleware/auth");
const upload = require("../../middleware/multer");
const User = mongoose.model("User");
const FoodItem = mongoose.model("FoodItem");

/**
 * POST /users/signup
 * Create a new local account.
 */
router.post("/users/signup", (req, res, next) => {
  const userType = ["employee", "vendor"];
  const errors = {};

  if (!validator.isEmail(req.body.user.email)) {
    errors.email = "enter a valid email address.";
  }

  if (!validator.isLength(req.body.user.password, { min: 8 })) {
    errors.password = "password must be at least 8 characters long.";
  }

  if (!userType.includes(req.body.user.userType)) {
    errors.userType = "user can be either an employee or a vendor.";
  }

  if (Object.keys(errors).length) {
    return res.json({ errors });
  }
  const user = new User({
    username: req.body.user.username,
    email: req.body.user.email,
    password: req.body.user.password,
    userType: req.body.user.userType,
  });

  user
    .save()
    .then(() => {
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

/**
 * POST /users/login
 * Sign in using email and password.
 */
router.post("/users/login", (req, res, next) => {
  if (!req.body.user.email) {
    return res.status(403).json({ errors: { email: "email can't be blank." } });
  }

  if (!req.body.user.password) {
    return res
      .status(403)
      .json({ errors: { password: "password can't be blank." } });
  }

  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(403).json(info);
    }
  })(req, res, next);
});

/**
 * GET /users/account
 * Get all info about signed in account.
 */
router.get("/users/account", auth.required, (req, res, next) => {
  User.findOne({ _id: req.payload.id })
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }

      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

/**
 * PUT /users/account
 * Update account information.
 */
router.put("/users/account", auth.required, (req, res, next) => {
  User.findById(req.payload.id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }

      // only update fields that were actually passed...
      if (typeof req.body.user.username !== "undefined") {
        user.username = req.body.user.username;
      }

      if (typeof req.body.user.name !== "undefined") {
        user.name = req.body.user.name;
      }

      if (typeof req.body.user.about !== "undefined") {
        user.about = req.body.user.about;
      }

      if (typeof req.body.user.username !== "undefined") {
        user.username = req.body.user.username;
      }

      if (typeof req.body.user.email !== "undefined") {
        if (!validator.isEmail(req.body.user.email)) {
          return res
            .status(422)
            .json({ errors: { email: "enter a valid email address." } });
        }
        user.email = req.body.user.email;
      }

      const { extraInfo } = req.body.user;
      if (typeof extraInfo !== "undefined") {
        for (let key in extraInfo) {
          user.extraInfo[key] = extraInfo[key];
          console.log(key, extraInfo[key]);
        }
      }

      return user.save().then((user) => {
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});

/**
 * PUT /users/account/profilePicture
 * Update account information.
 */
router.put(
  "/users/account/profilePicture",
  auth.required,
  upload.single("profilePicture"),
  (req, res, next) => {
    User.findById(req.payload.id)
      .then((user) => {
        if (!user) {
          return res.sendStatus(401);
        }

        if (typeof req.file.path !== "undefined") {
          user.profilePicture = req.file.path;
        }

        return user.save().then((user) => {
          return res.json({ user: user.toAuthJSON() });
        });
      })
      .catch(next);
  }
);

/**
 * DELETE /users/account/delete
 * Delete user account.
 */
router.delete("/users/account/delete", auth.required, (req, res, next) => {
  User.deleteOne({ _id: req.payload.id })
    .then(() => {
      return res.status(200).json({
        message: "your account has been deleted.",
      });
    })
    .catch(next);
});

module.exports = router;
