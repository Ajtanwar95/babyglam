const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentId: {
      type: String,
      required: true,
    },

    items: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        title: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        stock: {
          type: Number,
          required: true,
        },

        media: [{ type: String }],
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    address: {
      name: String,
      email: String,
      phone: String,
      line1: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    // Shiprocket information
    shiprocket: {
      orderId: {
        type: Number,
        default: null,
      },

      shipmentId: {
        type: Number,
        default: null,
      },

      awbCode: {
        type: String,
        default: null,
      },

      courierName: {
        type: String,
        default: null,
      },

      courierCompanyId: {
        type: Number,
        default: null,
      },

      trackingUrl: {
        type: String,
        default: null,
      },

      status: {
        type: String,
        default: null,
      },

      pickupScheduled: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
