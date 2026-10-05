const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");

const {
  getShiprocketToken,
  createShiprocketOrder,
} = require("../lib/shiprocket");

// Shiprocket connection test
router.get("/test", async (req, res) => {
  try {
    const token = await getShiprocketToken();

    res.status(200).json({
      success: true,
      message: "Shiprocket connected successfully",
      tokenReceived: !!token,
    });
  } catch (error) {
    console.error(
      "Shiprocket authentication error:",
      error.response?.data || error.message,
    );

    res.status(500).json({
      success: false,
      message: "Shiprocket authentication failed",
      error: error.response?.data || error.message,
    });
  }
});

// Create Shiprocket order from existing BabyGlam order
router.post("/create-order/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "BabyGlam order not found",
      });
    }

    // Prevent accidentally creating the same Shiprocket order twice
    if (order.shiprocket?.orderId) {
      return res.status(400).json({
        success: false,
        message: "Shiprocket order already exists",
        shiprocket: order.shiprocket,
      });
    }

    const productIds = order.items.map((item) => item._id);

    const products = await Product.find({
      _id: { $in: productIds },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products were not found",
      });
    }

    // Make sure shipping information exists
    for (const product of products) {
      if (
        !product.weight ||
        !product.length ||
        !product.breadth ||
        !product.height
      ) {
        return res.status(400).json({
          success: false,
          message: `Shipping dimensions missing for ${product.title}`,
        });
      }
    }

    const shiprocketResponse = await createShiprocketOrder({
      order,
      products,
    });

    console.log(
      "Shiprocket create order response:",
      JSON.stringify(shiprocketResponse, null, 2),
    );

    // Save Shiprocket order information
    order.shiprocket.orderId = shiprocketResponse.order_id || null;

    order.shiprocket.shipmentId = shiprocketResponse.shipment_id || null;

    order.shiprocket.status = "ORDER_CREATED";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Shiprocket order created successfully",
      shiprocket: shiprocketResponse,
      order,
    });
  } catch (error) {
    console.error(
      "Shiprocket order creation error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create Shiprocket order",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
