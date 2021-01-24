const mongoose = require("mongoose");
const router = require("express").Router();
// const validator = require("validator");
const auth = require("../../middleware/auth");
const Order = mongoose.model("Order");

/**
 * POST /orders/create
 * Create a Order.
 */
router.post("/create", auth.required, (req, res, next) => {
  const order = new Order({
    item: req.body.item,
    whoOrdered: req.payload.id,
  });

  order
    .save()
    .then((doc) => {
      return res.json({ order: doc });
    })
    .catch(next);
});

/**
 * GET /orders/
 * Get all orders.
 */
router.get("/", (req, res, next) => {
  Order.find()
    .populate("item", "name")
    .populate("whoOrdered", "username extraInfo")
    .then((orders) => {
      return res.json({ orders });
    })
    .catch(next);
});

/**
 * GET /orders/me
 * Get all orders created by an user.
 */
router.get("/me", auth.required, (req, res, next) => {
  Order.find({ whoOrdered: req.payload.id })
    .populate("item", "name")
    .populate("whoOrdered", "username extraInfo")
    .then((orders) => {
      return res.json({ orders });
    })
    .catch(next);
});

/**
 * GET /orders/admin
 * Get all orders created by an user.
 */
router.get("/admin", auth.required, (req, res, next) => {
  Order.find({})
    .populate({
      path: "item",
      match: { userCreated: { $eq: req.payload.id } },
    })
    .populate("whoOrdered", "username name")
    .then((orders) => {
      const docs = orders.filter((order) => order.item !== null);
      return res.json({ orders: docs });
    })
    .catch(next);
});

/**
 * PUT /orders/:orderId
 * Update order information.
 */
router.put("/:orderId", auth.required, (req, res, next) => {
  Order.findById(req.params.orderId)
    .then((order) => {
      if (!order) {
        return res.sendStatus(401);
      }

      // only update fields that were actually passed...
      if (typeof req.body.status !== "undefined") {
        order.status = req.body.status;
      }
      if (typeof req.body.estimatedTime !== "undefined") {
        order.foodType = req.body.estimatedTime;
      }

      return order.save().then((order) => {
        return res.json({ order });
      });
    })
    .catch(next);
});

module.exports = router;
