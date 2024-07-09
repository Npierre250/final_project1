import Schedule from "../models/Schedule";

export const createSchedule = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "user must be authenticated!" });
    }
    const { productTitle, productWeight, deliveryTime, reminder } = req.body;

    const newSchedule = new Schedule({
      userId: user._id,
      username: user.name,
      userEmail: user.email,
      productTitle,
      productWeight,
      deliveryTime,
      reminder,
    });

    await newSchedule.save();
    return res.status(201).json({
      message: "Schedule created successfully",
      schedule: newSchedule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getSchedulesByUserId = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User must be authenticated!" });
    }

    const schedules = await Schedule.find({ userId: user._id });

    res.status(200).json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getAllSchedules = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User must be authenticated!" });
    }

    if (user.role !== "superAdmin") {
      return res.status(403).json({ message: "you're not allowed" });
    }
    const schedules = await Schedule.find();

    res
      .status(200)
      .json(schedules );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User must be authenticated!" });
    }

    const { id } = req.params;
    const { productTitle, productWeight, deliveryTime, reminder } = req.body;

    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found!" });
    }

    if (schedule.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to edit this schedule!" });
    }

    schedule.productTitle = productTitle || schedule.productTitle;
    schedule.productWeight = productWeight || schedule.productWeight;
    schedule.deliveryTime = deliveryTime || schedule.deliveryTime;
    schedule.reminder = reminder || schedule.reminder;

    await schedule.save();

    res.status(200).json({ message: "Schedule updated successfully", schedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const updateScheduleByAdmin = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User must be authenticated!" });
    }

    if(user.role!=="superAdmin"){
      return res.status(403).json({message:"only super admin is allowed"})
    }

    const { id } = req.params;
    const { status } = req.body;

    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found!" });
    }

    schedule.status = status || schedule.status;
    await schedule.save();

    res.status(200).json({ message: "Schedule updated successfully", schedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


export const deleteSchedule = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User must be authenticated!" });
    }

    const { id } = req.params;

    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found!" });
    }

    if (schedule.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to delete this schedule!" });
    }

    await Schedule.deleteOne({ _id: id });

    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};