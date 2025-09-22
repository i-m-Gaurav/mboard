import Movie from "../models/movies.js";
import Vote from "../models/votes.js";
import Comment from "../models/comments.js";
import mongoose from "mongoose";


export const getAllMovies = async (req, res) => {
  try {
    const userId = req.user?.id; // undefined for non-logged-in users

    const movies = await Movie.find().lean();

    const moviesWithExtras = await Promise.all(
      movies.map(async (movie) => {
        const stats = await Vote.aggregate([
          { $match: { movie_id: new mongoose.Types.ObjectId(movie._id) } },
          { $group: { _id: "$vote", count: { $sum: 1 } } },
        ]);

        const likes = stats.find((s) => s._id === 1)?.count || 0;
        const dislikes = stats.find((s) => s._id === -1)?.count || 0;

        let userVote = 0;
        if (userId) {
          const userVoteDoc = await Vote.findOne({
            user_id: userId,
            movie_id: movie._id,
          });
          userVote = userVoteDoc ? userVoteDoc.vote : 0;
        }

        const comments = await Comment.find({ movie_id: movie._id }).sort({
          createdAt: 1,
        });

        return {
          ...movie,
          likes,
          dislikes,
          userVote,
          comments,
        };
      })
    );

    res.json(moviesWithExtras);
  } catch (error) {
    console.log(error);
  }
};

export const getAllComments = async (req, res) => {
  try {
    const { movieId } = req.params;

    const comments = await Comment.find({ movie_id: movieId }).sort({
      createdAt: 1,
    });
    res.json(comments);
  } catch (error) {}
};

export const suggestMovie = async (req, res) => {
  try {
    const { title, desc } = req.body;

    const newPost = new Movie({
      title,
      desc,
      added_by: req.user.id,
    });

    await newPost.save();
    res.json({
      Movie: newPost,
      message: "Movie is created",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error creating movie bro" });
  }
};

export const postComment = async (req, res) => {
  try {
    const { comment } = req.body;
    console.log("comment", comment);
    const { movieId } = req.params;

    const exists = await Movie.exists({
      _id: movieId,
    });

    if (!exists) {
      return res.status(404).json({ message: "movie not found" });
    }

    const username = req.user.name;
    console.log("username", username);

    const newComment = new Comment({
      comment,
      user_id: req.user.id,
      movie_id: movieId,
      username: username
    });

    await newComment.save();

    return res.status(201).json({ comment: newComment, message: "Commented" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating comment" });
  }
};

export const postVote = async (req,res) =>{
    try {
    const movieId = req.params.movieId;
    const userId = req.user.id;
    const voteValue = req.body.vote;

    if (![1, -1, 0].includes(voteValue)) {
      return res.status(400).json({ message: "Invalid vote value" });
    }

    if (voteValue === 0) {
      await Vote.deleteOne({ user_id: userId, movie_id: movieId });
    } else {
      await Vote.findOneAndUpdate(
        { user_id: userId, movie_id: movieId },
        { vote: voteValue },
        { upsert: true, new: true }
      );
    }

    // Aggregate total votes
    const totalVotes = await Vote.aggregate([
      { $match: { movie_id: new mongoose.Types.ObjectId(movieId) } },
      { $group: { _id: "$vote", count: { $sum: 1 } } }
    ]);

    const like = totalVotes.find((v) => v._id === 1)?.count || 0;
    const dislike = totalVotes.find((v) => v._id === -1)?.count || 0;

    // Correct property name here
    const userVoteDoc = await Vote.findOne({ user_id: userId, movie_id: movieId });
    const userVote = userVoteDoc ? userVoteDoc.vote : 0;

    return res.json({ likes: like, dislikes: dislike, userVote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getUserMovies = async (req, res) => {
  try {
    const userId = req.user?.id;

    const movies = await Movie.find({ added_by: userId }).lean();

   
    console.log("movies found:", movies);

    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMovie = async (req, res) => {

  try {

    const {movieId} = req.params;
    console.log("movieId to delete", movieId);
    
    console.log("req.user in delete movie", req.user.id);

    console.log("req.user role in delete movie", req.user.role);

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    console.log("this is before check");
    if(req.user.role !== 'admin' && movie.added_by.toString() !== req.user.id){
      return res.status(403).json({ message: "Forbidden: You can only delete your own movies" });
    }
      console.log("this is after check");

    await Movie.deleteOne({_id: movieId});

    res.json({message : "Movie deleted"});
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }


}



