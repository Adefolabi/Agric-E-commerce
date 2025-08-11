const { Cart } = require("../models/cart");
const { Order } = require("../models/orders");
const { Products } = require("../models/Products");

const checkout = async (req, res) => {
  try {
    const userId = req.user.Id || req.user._id;
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.item.length === 0)
      return res.status(404).send("User cart is empty ");
    const items = cart.item;
    let totalPrice = 0;
    const orderItem = [];
    const outOfStock = [];
    for (const item of items) {
      const productId = item.productId;
      const product = await Products.findById(productId);
      if (!product) {
        outOfStock.push(`Product not found: ${item.productId}`);
        continue;
      }

      const quantity = item.quantity;
      const quantityInStock = product.inventory;
      const notInStock = quantity > quantityInStock;
      console.log(notInStock);
      console.log(outOfStock);
      if (notInStock) {
        outOfStock.push(`${product.name} is out of stock`);
        continue;
      }
      const price = quantity * product.price;
      totalPrice += price;
      orderItem.push({
        productId: productId,
        name: product.name,
        quantity,
        price: product.price,
      });

      //   decrease stock
      quantityInStock -= quantity;
      await product.save();
    }
    if (outOfStock.length > 0) return res.status(400).json({ outOfStock });
    // create order
    const order = new Order({
      user: userId,
      items: orderItem,
      totalAmount: totalPrice,
      shippingAddress: "slfwprgvamö",
    });
    await order.save();

    // Clear Cart
    cart.item = [];
    await cart.save();
    res.status(201).json({ message: "order placed successfully", order });

    console.log(totalPrice);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

const getOrder = async (req, res) => {
  try {
    const userId = req.user.Id || req.user._id;
    const productId = req.params.id;
    const orders = await Order.find({ user: userId, productId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "firstName lastName");
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
}
module.exports = { checkout, getOrder,getAllOrders };
