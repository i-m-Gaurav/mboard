import express from "express";
import cors from "cors";
import connect from "./database/db.js";
import bcrypt from "bcrypt";
import User from "./models/user.js";
import Movie from "./models/movies.js";
import Comment from "./models/comments.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/auth.js";
import Vote from "./models/votes.js";
import mongoose from "mongoose";
import userRoutes from './routes/userRoutes.js';
import movieRoutes from './routes/movieRoutes.js';


dotenv.config();


// async function run() {
//   await mongoose.connect(process.env.MONGO_URL);
//   const email = process.env.INIT_ADMIN_EMAIL || "admin@movie.com";
//   const password = process.env.INIT_ADMIN_PW || "admin";

//   const existing = await User.findOne({ email });
//   if (existing) {
//     console.log("Admin already exists:", email);
//     process.exit(0);
//   }

//   const hashed = await bcrypt.hash(password, 12);
//   const admin = await User.create({
//     name: "Admin",
//     email,
//     password_hash: hashed,
//     role: "admin",
//   });

//   console.log("Admin created:", admin.email);
//   console.log("Change the password immediately after login.");
//   process.exit(0);
// }

// run().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });




const app = express();
const PORT = 3000;

connect();
app.use(express.json());
app.use(cors());

// app.get("/", (req, res) => {
//   res.send("server is working...")
// });


app.use('/api/user',userRoutes);
app.use('/api/movies',movieRoutes);




// app.listen(PORT, () => {
//   console.log(`Server is running on ${PORT}`);
// });


export default app;
