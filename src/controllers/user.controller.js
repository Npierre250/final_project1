import { User } from "../models/User";
import { BcryptUtil } from "../utils/bcryptjs";
import { generateToken } from "../utils/generateToken";

export const loginUser = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
      return res.status(400).json({ error: "user don't exist!" });
    }
    const passwordMaches = await BcryptUtil.compare(
      req.body.password,
      foundUser.password
    );
    if (!passwordMaches) {
      return res.status(400).json({ error: "passwords don't match!" });
    }
    const userToken = {
      _id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    };
    const token = generateToken(userToken);
    return res.status(200).json({
      message: "user logged in successfully!",
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        isactive: foundUser.isActive,
      },
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    // Find the user by email
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Verify the current password
    const passwordMatches = await BcryptUtil.compare(
      currentPassword,
      foundUser.password
    );
    if (!passwordMatches) {
      return res.status(400).json({ error: "Current password is incorrect!" });
    }

    // Hash the new password
    const hashedNewPassword = BcryptUtil.hash(newPassword);

    // Update the user's password in the database
    foundUser.password = hashedNewPassword;
    await foundUser.save();

    return res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Find the admin user
    const user = req.user
    if (!user || user.role!=="superAdmin") {
      return res.status(403).json({ message: 'unauthorized user!' });
    }

    // Retrieve all users except the admin
    const users = await User.find({ role: { $ne: 'superAdmin' } });

    // Check if each user is an admin

    // Send a response back to the client
    res.status(200).json( users );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
