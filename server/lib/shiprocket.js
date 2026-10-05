const axios = require("axios");

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

let shiprocketToken = null;
let tokenExpiresAt = 0;

const getShiprocketToken = async () => {
  // Reuse token while valid
  if (shiprocketToken && Date.now() < tokenExpiresAt) {
    return shiprocketToken;
  }

  const response = await axios.post(
    `${SHIPROCKET_BASE_URL}/auth/login`,
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  shiprocketToken = response.data.token;

  // Shiprocket tokens are documented as valid for 10 days.
  // Refresh slightly before expiration.
  tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;

  return shiprocketToken;
};

module.exports = {
  getShiprocketToken,
};
