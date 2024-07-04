import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    idNumber: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    farmLocation: {
      type: String,
      required: true,
    },
    farmLength: {
      type: String,
      required: true,
    },
    productionSeason: {
      type: String,
      required: true,
    },
    desiredProducts: {
      type: String,
      required: true,
    },
    tinNumber: {
      type: String,
      required: true,
    },
    licenceCopy: {
      type: String,
      required: true,
    },
    Status: {
      enum:['pending','rejected','approved']
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", ApplicationSchema);
