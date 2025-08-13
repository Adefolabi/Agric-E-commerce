const { Cart } = require("../models/cart");
const { Order } = require("../models/orders");
const { Products } = require("../models/Products");
const { orderCreationEmail } = require("./email");

const checkout = async (req, res) => {
  try {
    const userId = req.user.Id || req.user._id;

    // Get user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.item.length === 0) {
      return res.status(404).send("User cart is empty");
    }

    const items = cart.item;
    let totalAmount = 0;
    const orderItem = [];
    const outOfStock = [];

    //  Loop through cart items
    for (const item of items) {
      const product = await Products.findById(item.productId);
      if (!product) {
        outOfStock.push(`Product not found: ${item.productId}`);
        continue;
      }

      // Check stock
      if (item.quantity > product.inventory) {
        outOfStock.push(`${product.name} is out of stock`);
        continue;
      }

      // Calculate price
      const price = item.quantity * product.price;
      totalAmount += price;

      orderItem.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });

      // Decrease stock
      product.inventory -= item.quantity;
      await product.save();
    }

    // If some items are out of stock, stop checkout
    if (outOfStock.length > 0) {
      return res.status(400).json({ outOfStock });
    }

    // Create new order
    const order = new Order({
      user: userId,
      items: orderItem,
      totalAmount,
      shippingAddress: "slfwprgvamö", // replace with actual shipping address from req.body
    });
    await order.save();

    // Populate user info
    const userOrder = await Order.findOne({ _id: order._id }).populate(
      "user",
      "email firstName"
    );

    if (!userOrder) {
      return res.status(404).send("Order not found");
    }

    const { email, firstName } = userOrder.user;

    // Send order confirmation email
    orderCreationEmail(order._id, email, orderItem, firstName, totalAmount);

    // Clear the cart
    cart.item = [];
    await cart.save();

    // Send success response
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getOrder = async (req, res) => {
  try {
    const userId = req.user.Id || req.user._id;
    const orderId = req.params.id;
    const orders = await Order.find({ user: userId, _id: orderId });
    if (!orders || orders.length === 0)
      return res.status(404).json({ message: "No orders found" });
    if (
      req.user.role !== "Admin" &&
      orders.some((order) => order.user._id.toString() !== userId)
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to access order history" });
    }
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

const adminGetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "firstName lastName");
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.Id ;
    const orders = await Order.find({ user: userId })
      .populate("items.productId", "name price")
      .populate("user", "email firstName");
    console.log(orders.user);
    if (!orders || orders.length === 0)
      return res.status(404).json({ message: "User has not made an order" });
    if (
      req.user.role !== "Admin" &&
      orders.some((order) => order.user._id.toString() !== userId)
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to access order history" });
    }
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  checkout,
  getOrder,
  adminGetAllOrders,
  getOrderHistory,
};
