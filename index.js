import express from "express";
import cors from "cors";
import connect from "./src/database/db.js";
import dotenv from "dotenv";
import userRoutes from './src/routes/userRoutes.js';
import movieRoutes from './src/routes/movieRoutes.js';




const app = express();
dotenv.config();


connect();
app.use(express.json());
app.use(cors());




app.use('/api/user',userRoutes);
app.use('/api/movies',movieRoutes);

app.use("/", (req, res) => {
    res.send("API is running....");
});






export default app;
