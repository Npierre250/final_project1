import cron from 'node-cron';
import Subscription from "../models/Subscription.js";
import {sendEmail} from "../services/email.service.js"


const checkSubscriptions = async () => {
    const now = new Date();
    const expiringSoon = new Date(now);
    expiringSoon.setDate(now.getDate() + 30); 
  
    const subscriptions = await Subscription.find({
      expiryDate: { $lte: expiringSoon },
      status: "active",
    });
  
    subscriptions.forEach((subscription) => {
      const mailOptions = {
        sender: process.env.EMAIL,
        recipients: subscription.email,
        subject: "Subscription Renewal Reminder",
        message: `Dear user, your subscription will expire on ${subscription.expiryDate}. Please renew your subscription.`,
      };
  
      sendEmail(mailOptions)
      
    });
  };
  
  cron.schedule("0 0 * * *", checkSubscriptions);
  