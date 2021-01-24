const mongoose = require("mongoose");
const router = require("express").Router();
// const validator = require("validator");
const auth = require("../../middleware/auth");
const Category = mongoose.model("Category");

/**
 * POST /categories/create
 * Create a category.
 */
// TODO: add auth.required
router.post("/create", (req, res, next) => {
  const category = new Category({
    name: req.body.name,
  });

  category
    .save()
    .then(() => {
      return res.json({ category: category.toJSON() });
    })
    .catch(next);
});

/**
 * GET /categories/
 * Get all categories.
 */
router.get("/", (req, res, next) => {
  Category.find()
    .then((category) => {
      return res.json({ category });
    })
    .catch(next);
});

/**
 * DELETE :categoryId
 * Delete a category.
 */
router.delete("/:categoryId", (req, res, next) => {
  Category.deleteOne({ _id: req.params.categoryId })
    .then(() => {
      return res.json({ message: "category deleted successfully." });
    })
    .catch(next);
});

module.exports = router;
