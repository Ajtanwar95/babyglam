const axios = require("axios");

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

let shiprocketToken = null;
let tokenExpiresAt = 0;

// Get Shiprocket authentication token
const getShiprocketToken = async () => {
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

  // Keep token for 9 days
  tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;

  return shiprocketToken;
};

// Common authenticated request
const shiprocketRequest = async (method, endpoint, data = null) => {
  const token = await getShiprocketToken();

  const response = await axios({
    method,
    url: `${SHIPROCKET_BASE_URL}${endpoint}`,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
const createShiprocketOrder = async ({ order, products }) => {
  const items = order.items.map((item) => {
    const product = products.find(
      (p) => p._id.toString() === item._id.toString(),
    );

    if (!product) {
      throw new Error(`Product not found: ${item.title}`);
    }

    return {
      name: product.title,
      sku: product._id.toString(),
      units: item.quantity,
      selling_price: product.price,
      discount: "",
      tax: "",
      hsn: "",
    };
  });

  // Shiprocket expects weight in KG.
  const totalWeightKg = products.reduce((total, product) => {
    const orderItem = order.items.find(
      (item) => item._id.toString() === product._id.toString(),
    );

    const quantity = orderItem?.quantity || 0;

    // Your MongoDB weight is stored in grams.
    return total + (Number(product.weight) / 1000) * quantity;
  }, 0);

  // For now use the largest dimensions among the ordered products.
  // We will improve multi-product packaging later.
  const length = Math.max(...products.map((product) => Number(product.length)));

  const breadth = Math.max(
    ...products.map((product) => Number(product.breadth)),
  );

  const height = Math.max(...products.map((product) => Number(product.height)));

  const payload = {
    order_id: order.orderId,

    order_date: new Date(order.createdAt).toISOString(),

    pickup_location: "Home",

    channel_id: "",

    comment: "BabyGlam Website Order",

    billing_customer_name: order.address.name,
    billing_last_name: "",
    billing_address: order.address.line1,
    billing_address_2: "",
    billing_city: order.address.city,
    billing_pincode: order.address.zip,
    billing_state: order.address.state,
    billing_country: order.address.country || "India",
    billing_email: order.address.email,
    billing_phone: order.address.phone,

    shipping_is_billing: true,

    shipping_customer_name: order.address.name,
    shipping_last_name: "",
    shipping_address: order.address.line1,
    shipping_address_2: "",
    shipping_city: order.address.city,
    shipping_pincode: order.address.zip,
    shipping_state: order.address.state,
    shipping_country: order.address.country || "India",
    shipping_email: order.address.email,
    shipping_phone: order.address.phone,

    order_items: items,

    payment_method: "Prepaid",

    shipping_charges: 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,

    sub_total: Number(order.total),

    length,
    breadth,
    height,
    weight: Math.max(totalWeightKg, 0.1),
  };

  console.log("Creating Shiprocket order:", JSON.stringify(payload, null, 2));

  return await shiprocketRequest("POST", "/orders/create/adhoc", payload);
};
module.exports = {
  getShiprocketToken,
  shiprocketRequest,
  createShiprocketOrder,
};
