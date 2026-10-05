const express = require("express");
const router = express.Router();

const Razorpay = require("razorpay");
const Order = require("../models/Order");
const Product = require("../models/Product");

const { createShiprocketOrder } = require("../lib/shiprocket");

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/", async (req, res) => {
  try {
    const { items, total, address, paymentId, orderId } = req.body;

    // --------------------------------------------------
    // 1. Basic validation
    // --------------------------------------------------

    if (!items?.length || !paymentId || !orderId || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing order information",
      });
    }

    // --------------------------------------------------
    // 2. Verify Razorpay payment
    // --------------------------------------------------

    const payment = await razorpay.payments.fetch(paymentId);

    if (
      payment.order_id !== orderId ||
      payment.status !== "captured" ||
      payment.currency !== "INR"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment is not valid or captured",
      });
    }

    // --------------------------------------------------
    // 3. Prevent duplicate orders
    // --------------------------------------------------

    const existingOrder = await Order.findOne({
      $or: [{ orderId }, { paymentId }],
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already exists",
        order: existingOrder,
      });
    }

    // --------------------------------------------------
    // 4. Get real products from MongoDB
    // --------------------------------------------------

    const productIds = items.map((item) => item._id);

    const products = await Product.find({
      _id: { $in: productIds },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products were not found",
      });
    }

    // --------------------------------------------------
    // 5. Validate products + calculate real total
    // --------------------------------------------------

    let calculatedTotal = 0;

    const formattedItems = [];

    for (const item of items) {
      const product = products.find(
        (p) => p._id.toString() === item._id.toString(),
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.title}`,
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${product.title}`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.title} is out of stock`,
        });
      }

      // Make sure shipping information exists
      if (
        !product.weight ||
        !product.length ||
        !product.breadth ||
        !product.height
      ) {
        return res.status(400).json({
          success: false,
          message: `Shipping dimensions are missing for ${product.title}`,
        });
      }

      const itemTotal = Number(product.price) * quantity;

      calculatedTotal += itemTotal;

      formattedItems.push({
        _id: product._id,
        title: product.title,
        price: product.price,
        quantity,
        stock: product.stock,
        media: product.media || [],
      });
    }

    // --------------------------------------------------
    // 6. Verify Razorpay amount against MongoDB price
    // --------------------------------------------------

    const paymentAmount = Number(payment.amount);
    const expectedAmount = Math.round(calculatedTotal * 100);

    if (paymentAmount !== expectedAmount) {
      console.error("Payment amount mismatch:", {
        paymentAmount,
        expectedAmount,
        calculatedTotal,
      });

      return res.status(400).json({
        success: false,
        message: "Payment amount does not match order total",
      });
    }

    // --------------------------------------------------
    // 7. Create BabyGlam MongoDB order
    // --------------------------------------------------

    const order = new Order({
      orderId,
      paymentId,

      items: formattedItems,

      total: calculatedTotal,

      address,

      status: "Processing",

      shiprocket: {
        orderId: null,
        shipmentId: null,
        awbCode: null,
        courierName: null,
        courierCompanyId: null,
        trackingUrl: null,
        status: null,
        pickupScheduled: false,
      },
    });

    await order.save();

    // --------------------------------------------------
    // 8. Create Shiprocket order
    // --------------------------------------------------

    try {
      const shiprocketResponse = await createShiprocketOrder({
        order,
        products,
      });

      console.log(
        "Shiprocket order created:",
        JSON.stringify(shiprocketResponse, null, 2),
      );

      // ------------------------------------------------
      // 9. Save Shiprocket information
      // ------------------------------------------------

      order.shiprocket.orderId = shiprocketResponse.order_id || null;

      order.shiprocket.shipmentId = shiprocketResponse.shipment_id || null;

      order.shiprocket.awbCode = shiprocketResponse.awb_code || null;

      order.shiprocket.courierName = shiprocketResponse.courier_name || null;

      order.shiprocket.courierCompanyId =
        shiprocketResponse.courier_company_id || null;

      order.shiprocket.status = shiprocketResponse.status || "NEW";

      await order.save();
    } catch (shiprocketError) {
      // ----------------------------------------------
      // IMPORTANT:
      // Payment succeeded and MongoDB order exists.
      // Do NOT tell customer that payment failed.
      // ----------------------------------------------

      console.error(
        "Shiprocket order creation failed:",
        shiprocketError.response?.data || shiprocketError.message,
      );

      order.shiprocket.status = "SHIPROCKET_FAILED";

      await order.save();
    }

    // --------------------------------------------------
    // 10. Return successful order response
    // --------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Payment confirmed and order created",
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate order",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create order",
    });
  }
});

module.exports = router;
