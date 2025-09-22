import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      email: email,
      password_hash: hashedPassword,
    });

    await newUser.save();

    res.json({ message: "user created successfully" });
  } catch (error) {
    console.log({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getProfile = async (req,res) => {
try {
  const { id } = req.user;
  // console.log("userId in get profile", id);
  const user = await User.find({ _id: id });

  // console.log(user);
  // console.log(user);
  res.json(user);
} catch (error) {
  console.error("Error fetching user profile:", error);
  res.status(500).json({ message: "Server error" });  
}

}
