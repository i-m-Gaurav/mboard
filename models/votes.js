import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
    user_id : {type : mongoose.Schema.Types.ObjectId, ref : 'User', required:true},
    movie_id: {type : mongoose.Schema.Types.ObjectId, ref : 'Movie', required:true},
    vote : {type : Number, enum:[-1,1], required: true}
},{timestamps:true});

voteSchema.index({user_id:1, movie_id:1},{unique:true});

const Vote = mongoose.model('Vote',voteSchema);
export default Vote;