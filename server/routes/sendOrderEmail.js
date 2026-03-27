// server/routes/sendOrderEmail.js
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, orderId, orderData } = req.body;

    if (!email || !orderId || !orderData) {
      return res.status(400).json({ error: "Email, orderId, and orderData are required" });
    }

    // Lazy load Resend only when the route is called
    const { Resend } = require("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing in environment variables");
      return res.status(500).json({ error: "Email service not configured" });
    }

    const trackLink = `${process.env.FRONTEND_URL || "https://babyglam.in"}/track-order/${orderId}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>Order Confirmation - BabyGlam</title></head>
      <body style="font-family: system-ui, Arial, sans-serif; background:#f9fafb; padding:20px;">
        <div style="max-width:620px; margin:0 auto; background:white; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
          <div style="background:linear-gradient(to right, #9bced3, #7db8c0); color:white; padding:40px 20px; text-align:center;">
            <h1 style="margin:0; font-size:32px;">🎉 Order Confirmed!</h1>
            <p style="margin:12px 0 0; font-size:18px;">Thank you for shopping with BabyGlam</p>
          </div>
          
          <div style="padding:40px 30px;">
            <p style="font-size:17px; color:#374151;">Hi <strong>${orderData.address.name}</strong>,</p>
            <p>Your order <strong>#${orderId}</strong> has been successfully placed.</p>

            <div style="background:#f8fafc; padding:20px; border-radius:12px; margin:25px 0;">
              <strong>Total:</strong> ₹${orderData.total}<br>
              <strong>Payment ID:</strong> ${orderData.paymentId || 'N/A'}
            </div>

            <h3 style="margin:25px 0 10px;">Items Ordered</h3>
            <ul style="padding-left:20px; margin:0 0 25px;">
              ${orderData.items.map(item => `
                <li style="margin:8px 0;">${item.title} × ${item.quantity} — ₹${item.price}</li>
              `).join('')}
            </ul>

            <div style="margin:35px 0; text-align:center;">
              <a href="${trackLink}" 
                 style="background:#9bced3; color:white; padding:16px 32px; text-decoration:none; border-radius:9999px; font-weight:600; display:inline-block; font-size:16px;">
                Track Your Order
              </a>
            </div>

            <p style="color:#6b7280; font-size:14px; text-align:center;">
              Track anytime here:<br>
              <a href="${trackLink}" style="color:#9bced3; word-break:break-all;">${trackLink}</a>
            </p>
          </div>

          <div style="background:#f1f5f9; padding:20px; text-align:center; font-size:13px; color:#64748b;">
            BabyGlam • New Delhi
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error: resendError } = await resend.emails.send({
      from: "BabyGlam <onboarding@resend.dev>",
      to: [email],
      subject: `Order Confirmation #${orderId} - BabyGlam`,
      html,
    });

    if (resendError) {
      console.error("Resend Error:", resendError);
      return res.status(500).json({ error: "Failed to send email", details: resendError.message });
    }

    console.log(`✅ Email sent to ${email} for order ${orderId}`);
    res.json({ success: true, message: "Email sent successfully" });

  } catch (err) {
    console.error("Send email catch error:", err);
    res.status(500).json({ 
      error: "Server error sending email", 
      details: err.message 
    });
  }
});

module.exports = router;