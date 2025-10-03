const nodemailer = require('nodemailer');
const Otp = require('../Model/otpModel');
const PendingUser = require('../Model/pendingUserModel');
const User = require('../Model/userModel');

const sendOtp = async (email) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expireAt = new Date(Date.now() + 15 * 60 * 1000);
    await Otp.create({ email, otp, expireAt })

    let responser = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MyEmail,
        pass: process.env.MyPass
      }
    })

    let mailOptions = {
      from: process.env.MyEmail,
      to: email,
      subject: 'FarmHelper-Please verify your account',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7f9fc;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;">
        <tr>
            <td align="center" style="padding: 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);">
                    
                    <tr>
                        <td align="center" style="padding: 30px 0 20px 0; background-color: #ffffff; border-top-left-radius: 12px; border-top-right-radius: 12px;">
                            <h1 style="margin: 0; font-size: 32px; color: #333333; letter-spacing: -0.5px; font-weight: 700;">Farm Helper</h1>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 0 40px;">
                            <h2 style="font-size: 26px; margin: 20px 0 10px 0; color: #2a2a2a; font-weight: 600; text-align: center;">Verify Your Identity</h2>
                            <p style="font-size: 16px; color: #555555; line-height: 1.6; text-align: center;">
                                Hi there,
                                <br>
                                We received a request to access your account. To proceed, please use the following One-Time Password (OTP):
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="padding: 20px 40px;">
                            <div style="background-color: #e6f2ff; border-radius: 10px; padding: 25px; text-align: center; border: 1px solid #cce0ff;">
                                <p style="font-size: 42px; font-weight: bold; color: #007bff; margin: 0; letter-spacing: 8px;">
                                    ${otp}
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <p style="font-size: 14px; color: #888888; text-align: center; margin-bottom: 25px;">
                                This code is valid for <strong>10 minutes</strong> and can only be used once.
                            </p>
                            <p style="font-size: 14px; color: #666666; line-height: 1.6; text-align: center; border-top: 1px solid #f0f0f0; padding-top: 20px;">
                                If you did not request this code, please disregard this email. Your account security is our top priority.
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="background-color: #f0f4f8; padding: 25px 40px; text-align: center; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                            <p style="margin: 0; font-size: 12px; color: #777777;">
                                &copy; 2025 Farm Helper. All rights reserved. <br>
                                Need help? Visit our <a href="#" style="color: #007bff; text-decoration: none;">Support Center</a>.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
    }
    await responser.sendMail(mailOptions)
  } catch (error) {
    console.log(error)
  }
}

const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required!" });
    }

    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) return res.status(400).json({ message: "No OTP request found!" });
    if (otpRecord.expireAt < Date.now()) return res.status(400).json({ message: "OTP expired!" });
    if (otp !== otpRecord.otp) return res.status(400).json({ message: "Invalid OTP!" });

    const pendingUser = await PendingUser.findOne({ email: otpRecord.email });
    if (!pendingUser) return res.status(400).json({ message: "Pending user not found!" });

    // Create actual user
    await User.create({
      username: pendingUser.username,
      email: pendingUser.email,
      password: pendingUser.password
    });

    // Delete pending user and OTP
    await PendingUser.deleteOne({ email: email });
    await Otp.deleteOne({ email: email });

    res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};




module.exports = {
  sendOtp,
  verifyOtp
}