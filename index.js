import express from "express";
import cors from "cors";
import connect from "./database/db.js";
import dotenv from "dotenv";
import userRoutes from './routes/userRoutes.js';
import movieRoutes from './routes/movieRoutes.js';




const app = express();
dotenv.config();


connect();
app.use(express.json());
app.use(cors());


app.use("/api", (req, res) => {
    res.send("API is running....");
});


app.use('/api/user',userRoutes);
app.use('/api/movies',movieRoutes);





export default app;
