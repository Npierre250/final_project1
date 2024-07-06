import Schedule from "../models/Schedule";

export const createSchedule = async (req, res) => {
  try {
    const user = req.user;

    console.log("user===", user);

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
    return res
      .status(201)
      .json({
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
  
      console.log("user===", user);
  
      if (!user) {
        return res.status(401).json({ message: "User must be authenticated!" });
      }
  
      const schedules = await Schedule.find({ userId: user._id });

      res.status(200).json({ message: 'Schedules retrieved successfully', schedules });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  };
