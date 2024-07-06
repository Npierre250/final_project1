import { Application } from "../models/Application";
import { User } from "../models/User";
import { sendEmail } from "../services/email.service";
import "dotenv/config"
import { generateRandomPassword } from "../utils/randomPassword";
import { BcryptUtil } from "../utils/bcryptjs";

export const createApplication = async (req, res) => {
    try {
      // Use the multer middleware to handle the file upload
  
        const { idNumber, name, email, phoneNumber, farmLocation, farmLength, productionSeason, desiredProducts, tinNumber } = req.body;
        const licenceCopy = req.file ? req.file.path : null;
  
        // Check if licenceCopy was successfully uploaded
        if (!licenceCopy) {
          return res.status(400).json({ error: 'Licence copy is required' });
        }
  
        // Create a new application
        const application = new Application({
          idNumber,
          name,
          email,
          phoneNumber,
          farmLocation,
          farmLength,
          productionSeason,
          desiredProducts,
          tinNumber,
          licenceCopy
        });

        const data={
            htmlMessage: `
            <html>
              <body>
                <div style="text-align: center;">
                  <img src="cid:companylogo" alt="Company Logo" style="width: 100px; height: auto;" />
                  <h1>Application Received</h1>
                  <p>Dear ${name},</p>
                  <p>Your application has been received successfully. We will review your application and get back to you shortly.</p>
                  <p>Best regards,<br>Company Name</p>
                </div>
              </body>
            </html>
          `
        }
        // Save the application to the database
        await application.save();
        const emailDTO = {
            sender: { name: 'NAEB Customer Service', address: process.env.MAIL_USER },
            recipients: [{ name, address: email }],
            subject: 'Application Received',
            message: `Dear ${name},\n\nYour application has been received successfully. We will review your application and get back to you shortly.\n\nBest regards,\nNAEB`,
            data
          };

          await sendEmail(emailDTO);
  
        return res.status(201).json({ message: 'Application created successfully', application });
    } catch (error) {
        console.log(error)
      return res.status(500).json({ error: error });
    }
  };

  export const updateApplicationStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const application = await Application.findById(id);
  
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
  
      application.Status = status;
      await application.save();
  
      if (status === 'approved') {
        // Check if user already exists
        let user = await User.findOne({ email: application.email });
  
        if (!user) {
          // Generate a random password
          const randomPassword = generateRandomPassword();
          
          // Hash the password
          const hashedPassword = BcryptUtil.hash(randomPassword);
  
          user = new User({
            name: application.name,
            email: application.email,
            phoneNumber: application.phoneNumber,
            idNumber: application.idNumber,
            password: hashedPassword,
          });
  
          await user.save();

          const data={
            htmlMessage: `
            <html>
              <body>
                <div style="text-align: center;">
                  <img src="cid:companylogo" alt="Company Logo" style="width: 100px; height: auto;" />
                  <h1>Application Approved and Account Created</h1>
                  <p>Dear ${application.name},</p>
                  <p>Your application has been approved successfully. Your account has been created with the following credentials:</p>
                  <p>Email: ${application.email}</p>
                  <p>Password: ${randomPassword}</p>
                  <p>Please change your password after logging in for the first time.</p>
                  <p>Best regards,<br>Company Name</p>
                </div>
              </body>
            </html>
          `
          }
          const emailDTO = {
            sender: { name: 'NAEB Customer Service', address: process.env.MAIL_USER },
            recipients: [{ name: application.name, address: application.email }],
            subject: 'Application Approved and Account Created',
            message: `Dear ${application.name},\n\nYour application has been approved successfully. Your account has been created with the following credentials:\n\nEmail: ${application.email}\nPassword: ${randomPassword}\n\nPlease change your password after logging in for the first time.\n\nBest regards,\nCompany Name`,
            data
          };
  
          await sendEmail(emailDTO);
        }
      }
  
      return res.status(200).json({ message: 'Application status updated successfully', application });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  };