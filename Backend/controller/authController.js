const User = require('../Model/userModel');
const { sendOtp } = require('../controller/otpController')
const PendingUser = require('../Model/pendingUserModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

//Register
const register = async (req, res) => {
  try {
    const { username, password, email } = req.body || {};

    //checks if any field isnt filled
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //checks if user exists with same username or email
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      if (existing.email === email) {
        return res.status(400).json({ message: "Email already exists!" });
      }
      if (existing.username === username) {
        return res.status(400).json({ message: "Username already exists!" });
      }
    }

    //instead of storing raw pass storing hashed pass using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    //storing in pendingUser till otp isnt verified
    // Ensure pending record not duplicated; await the query
    const pending = await PendingUser.findOne({ $or: [{ username }, { email }] });
    if (!pending) {
      await PendingUser.create({ username, email, password: hashedPassword, createdAt: new Date() });
    } else {
      // Optionally update password if re-registering within window
      await PendingUser.updateOne({ _id: pending._id }, { password: hashedPassword, createdAt: new Date() });
    }

    // Send OTP and only respond after success
    await sendOtp(email);
    return res.status(200).json({ message: 'OTP sent to email. Verify within 15 minutes!', email });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};


const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Allow email or username lookup if desired
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid Username!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong Password!" });
    }

    // Minimal claims; never include password
    const token = jwt.sign(
      { sub: user._id.toString(), username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = {
  login,
  register
}