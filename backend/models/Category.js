const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "name can't be blank"],
    },
  },
  { timestamps: true }
);

CategorySchema.plugin(uniqueValidator, {
  message: "{PATH} has already exists.",
});


CategorySchema.methods.toJSON = function () {
  return {
    id: this._id,
    name: this.name,
  };
};

mongoose.model("Category", CategorySchema);
