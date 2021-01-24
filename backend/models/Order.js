const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const OrderSchema = new mongoose.Schema(
  {
    item: {type: mongoose.Schema.Types.ObjectId, ref: "FoodItem"},
    whoOrdered: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    estimatedTime: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: ["pending", "cooking", "finished"],
      default: "pending",
    },
  },
  { timestamps: true }
);

OrderSchema.plugin(uniqueValidator, {
  message: "{PATH} has already exists.",
});

mongoose.model("Order", OrderSchema);
