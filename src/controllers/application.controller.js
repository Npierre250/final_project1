import { Application } from "../models/Application";
import { sendEmail } from "../services/email.service";
import "dotenv/config"

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
            message: `Dear ${name},\n\nYour application has been received successfully. We will review your application and get back to you shortly.\n\nBest regards,\nCompany Name`,
            data
          };

          await sendEmail(emailDTO);
  
        return res.status(201).json({ message: 'Application created successfully', application });
    } catch (error) {
        console.log(error)
      return res.status(500).json({ error: error });
    }
  };