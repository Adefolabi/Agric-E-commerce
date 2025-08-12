const nodemailer = require("nodemailer");
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

const sendAccountCreationEmail = (recipient) => {
  let mailOptions = {
    from: EMAIL,
    to: recipient,
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

const sendAccountLoginEmail = async (req, recipient) => {
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
    to: recipient,
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

module.exports = { sendAccountCreationEmail, sendAccountLoginEmail };
