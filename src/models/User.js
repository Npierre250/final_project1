import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password:{
        type:String,
        required:true
    },
    role: {
      type: String,
      enum: ['member', 'superAdmin'], 
      default: 'member',
    },
    idNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
