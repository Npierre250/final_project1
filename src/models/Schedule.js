import mongoose from "mongoose";

const { Schema } = mongoose;

const scheduleSchema = new Schema({
  username: {
    type: String,
  },
  userEmail: {
    type: String,
  },
  userId:{
    type:String
  },
  productTitle: {
    type: String,
    required: true,
  },
  productWeight: {
    type: Number,
    required: true,
  },
  deliveryTime: {
    type: Date,
    required: true,
  },
  reminder: {
    type: String,
    enum: ["before 1h", "before 2h", "before 3h"],
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
