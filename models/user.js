import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password_hash:String,
    role: {type: String, default: "user"},
    createdAt: {type: Date, default: Date.now}

},{timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;