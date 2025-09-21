import mongoose from "mongoose";


const commentsSchema = new mongoose.Schema({
    comment : {type :String, required:true},
    user_id : {type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true},
    movie_id : {type : mongoose.Schema.Types.ObjectId, ref : 'Movie', required : true},
    createdAt: { type: Date, default: Date.now }

},{timestamps: true});

const Comment = mongoose.model('Comment', commentsSchema);
export default Comment;