import { User } from "../models/User";
import { BcryptUtil } from "../utils/bcryptjs";
import { generateToken } from "../utils/generateToken";
import "dotenv/config"

const adminSeeder = async () => {
  try {
    const adminUser = await User.findOne({ email: "calvinusbukaran@gmail.com" });
    if (adminUser) {
      console.log("Admin user is already created!");
      return;
    }
    const adminUserData = {
      name: "Admin User",
      email: process.env.ADMIN_MAIL,
      phoneNumber: "+250786639348",
      idNumber: "123456789",
      role: "superAdmin",
    };

    const hashedPassword = await BcryptUtil.hash(process.env.ADMIN_PWD); 

    adminUserData.password = hashedPassword;

    const createdAdminUser = await User.create(adminUserData);

    const token = generateToken(createdAdminUser);

    console.log("Admin user seeded successfully");
    console.log("Admin user token:", token);
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

export default adminSeeder;
