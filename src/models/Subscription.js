import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  subscriptionDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  transactionId: {
    type: String,
  },
  sender: {
    type: String,
  },
  senderCountry: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
