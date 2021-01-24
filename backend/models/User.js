const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../config");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "username can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "username is invalid"],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "email can't be blank."],
      match: [/\S+@\S+\.\S+/, "email is invalid."],
      index: true,
    },
    password: String,

    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" }],

    userType: {
      type: String,
      enum: ["employee", "vendor"],
      default: "employee",
    },

    name: String,
    about: String,
    profilePicture: String,

    extraInfo: {
      employeeId: String,
      organization: String,
      mobileNo: String,
      identityCard: String,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, {
  message: "{PATH} has already taken.",
});

/**
 * Password hash middleware.
 */
UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    },
    config.secret
  );
};

UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    userType: this.userType,
    favorites: this.favorites,
    name: this.name,
    about: this.about,
    profilePicture: this.profilePicture,
    token: this.generateJWT(),
    extraInfo: this.extraInfo,
  };
};

UserSchema.methods.toProfileJSONFor = function (user) {
  const md5 = crypto.createHash("md5").update(this.email).digest("hex");
  return {
    username: this.username,
    bio: this.bio,
    image: this.image || `https://gravatar.com/avatar/${md5}?s=200&d=retro`,
  };
};

UserSchema.methods.favorite = function (id) {
  if (this.favorites.indexOf(id) === -1) {
    this.favorites.push(id);
  }

  return this.save();
};

UserSchema.methods.unfavorite = function (id) {
  this.favorites.remove(id);
  return this.save();
};

UserSchema.methods.isFavorite = function (id) {
  return this.favorites.some(function (favoriteId) {
    return favoriteId.toString() === id.toString();
  });
};

mongoose.model("User", UserSchema);
