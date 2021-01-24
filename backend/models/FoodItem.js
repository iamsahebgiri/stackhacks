const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const User = mongoose.model("User");

const FoodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "name can't be blank"],
    },
    picture: String,
    price: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    userCreated: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    inStock: {
      type: Boolean,
      default: true,
    },
    foodType: {
      type: String,
      enum: ["vegetarian", "non-vegetarian"],
      default: "vegetarian",
    },
  },
  { timestamps: true }
);

FoodItemSchema.plugin(uniqueValidator, {
  message: "{PATH} has already exists.",
});

FoodItemSchema.methods.toJSON = function () {
  return {
    id: this._id,
    name: this.name,
    picture: this.picture,
    price: this.price,
    category: this.category,
    inStock: this.inStock,
    foodType: this.foodType,
    userCreated: this.userCreated,
  };
};

mongoose.model("FoodItem", FoodItemSchema);
