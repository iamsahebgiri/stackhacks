const mongoose = require("mongoose");
const router = require("express").Router();
const validator = require("validator");
const fs = require("fs");
const auth = require("../../middleware/auth");
const FoodItem = mongoose.model("FoodItem");
const Order = mongoose.model("Order");
const upload = require("../../middleware/multer");

/**
 * POST /fooditems/create
 * Create a food item.
 */
router.post(
  "/create",
  auth.required,
  upload.single("picture"),
  (req, res, next) => {
    const foodItem = new FoodItem({
      name: req.body.name,
      picture: req.file.path,
      price: req.body.price,
      category: req.body.category,
      inStock: req.body.inStock,
      foodType: req.body.foodType,
      userCreated: req.payload.id,
    });

    foodItem
      .save()
      .then((savedFoodItem) => {
        savedFoodItem
          .populate("category")
          .populate("userCreated")
          .execPopulate()
          .then((popudatedFoodItem) => {
            return res.json({ foodItem: popudatedFoodItem });
          });
      })
      .catch(next);
  }
);

/**
 * GET /fooditems/me
 * Get all fooditems created by an user.
 */
router.get("/me", auth.required, (req, res, next) => {
  FoodItem.find({ userCreated: req.payload.id })
    .populate("category")
    .populate("userCreated", "username name")
    .then((foodItems) => {
      return res.json({ foodItems });
    })
    .catch(next);
});

/**
 * GET /fooditems/
 * Get fooditems.
 */
router.get("/", (req, res, next) => {
  FoodItem.find()
    .populate("category")
    .populate("userCreated", "username name")
    .then((foodItems) => {
      return res.json({ foodItems });
    })
    .catch(next);
});

/**
 * GET /fooditems/:foodItemId
 * Get a fooditem.
 */
router.get("/:foodItemId", (req, res, next) => {
  FoodItem.findById(req.params.foodItemId)
    .populate("category")
    .populate("userCreated", "username name")
    .then((foodItem) => {
      return res.json({ foodItem });
    })
    .catch(next);
});

/**
 * PUT /fooditems/:foodItemId
 * Update account information.
 */
router.put(
  "/:foodItemId",
  auth.required,
  upload.single("picture"),
  (req, res, next) => {
    FoodItem.findById(req.params.foodItemId)
      .then((foodItem) => {
        if (!foodItem) {
          return res.sendStatus(401);
        }

        // only update fields that were actually passed...
        // sorry for repeating code
        if (typeof req.body.name !== "undefined") {
          foodItem.name = req.body.name;
        }
        if (typeof req.file?.path !== "undefined") {
          foodItem.picture = req.file.path;
        }
        if (typeof req.body.price !== "undefined") {
          foodItem.price = req.body.price;
        }
        if (typeof req.body.category !== "undefined") {
          foodItem.category = req.body.category;
        }
        if (typeof req.body.inStock !== "undefined") {
          foodItem.inStock = req.body.inStock;
        }
        if (typeof req.body.foodType !== "undefined") {
          foodItem.foodType = req.body.foodType;
        }

        return foodItem.save().then((foodItem) => {
          return res.json({ foodItem: foodItem.toJSON() });
        });
      })
      .catch(next);
  }
);

/**
 * DELETE :foodItemId
 * Delete a Food Item.
 */
router.delete("/:foodItemId", auth.required, (req, res, next) => {
  FoodItem.findOneAndDelete({ _id: req.params.foodItemId })
    .then((docs) => {
      fs.unlinkSync(`./${docs.picture}`);
      Order.deleteMany({ item: req.params.foodItemId }).then(() => {
        return res.json({ message: "food item deleted successfully." });
      });
    })
    .catch(next);
});

module.exports = router;
