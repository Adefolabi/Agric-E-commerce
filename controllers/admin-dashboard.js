// const mongoose = require("mongoose");
const { Users } = require("../models/users");
const { Products } = require("../models/Products");
const { Order } = require("../models/orders");
const dashboardOverview = async (req, res) => {
  const Usercount = await Users.countDocuments();
  const orderCount = await Order.countDocuments();
  const lowStock = await Products.find({ inventory: { $lt: 5 } })
    .populate("category", "name")
    .populate("subcategory", "name");
  const pendingOrders = await Order.countDocuments({ status: "pending" });

  res
    .status(200)
    .json({
      totalUser: Usercount,
      totalOrder: orderCount,
      pendingOrders: pendingOrders,
      lowStock: lowStock,
    });
};

module.exports = { dashboardOverview };
