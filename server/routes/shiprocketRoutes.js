const express = require("express");
const router = express.Router();

const { getShiprocketToken } = require("../lib/shiprocket");

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

module.exports = router;
