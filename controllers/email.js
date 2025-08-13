const { date } = require("joi");
const nodemailer = require("nodemailer");
const { formatDate } = require("../utils");
const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
// send email

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

const sendAccountCreationEmail = (userEmail) => {
  let mailOptions = {
    from: EMAIL,
    to: userEmail,
    subject: "Account creation SUCCESSFULL",
    text: `Thanks for signing up. We're glad to have you!`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const sendAccountLoginEmail = async (req, userEmail) => {
  // get ip and logintime
  const ipAddress = req.ip;
  const loginTime = new Date().toLocaleString();
  // Get location info
  const geoResponse = await fetch(`http://ip-api.com/json/${ipAddress}`);
  const geoData = await geoResponse.json();

  const location =
    geoData.status === "success"
      ? `${geoData.city}, ${geoData.country}`
      : "Unknown location";

  let mailOptions = {
    from: EMAIL,
    to: userEmail,
    subject: "🔐 New Login Detected",
    text: `Hello,

We noticed a new login to your account.

📅 Time: ${loginTime}
📍 IP Address: ${ipAddress}
    location:${location}

If this was you, no action is needed.  
If you don’t recognize this login, please reset your password immediately.

Stay safe,  
Your Support Team`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      consoleconsole.log("Email sent: " + info.response);
    }
  });
};

const orderCreationEmail = async (
  orderId,
  userEmail,
  orderItem,
  customerName,
  totalAmount
) => {
  // order creation time
  const orderTime = new Date().toLocaleString();
  // delivery date
  const deliveryDate = formatDate(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );

  let mailOptions = {
    from: EMAIL,
    to: userEmail,
    subject: "🛒 Order Confirmation - Thank You for Your Purchase!",
    text: `Hello ${customerName},

Thank you for your order! 🎉

🧾 Order ID: ${orderId}
📦 Items:
${orderItem
  .map((item) => `- ${item.name} x${item.quantity} @ ₦${item.price}`)
  .join("\n")}

💰 Total: ₦${totalAmount}
🚚 Estimated Delivery: ${deliveryDate}

We’ll notify you once your order is shipped. You can track your order anytime from your account.

If you have any questions, feel free to reach out to our support team.

Thanks again for shopping with us!

Warm regards,  
Your Agric E-commerce Team`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      consoleconsole.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  sendAccountCreationEmail,
  sendAccountLoginEmail,
  orderCreationEmail,
};
