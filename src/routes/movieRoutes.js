import express from 'express'
import authMiddleware, { isAdmin } from '../middleware/auth.js';
import { getAllComments, getAllMovies,postVote,deleteMovie,postComment,deleteComment,suggestMovie,getUserMovies } from '../controllers/movieController.js';
const router = express.Router();


router.get("/getAllMovies", authMiddleware, getAllMovies);
router.get("/getAllComments", authMiddleware, getAllComments);
router.post("/suggestMovie",authMiddleware,suggestMovie);
router.post("/suggestedMovie/:movieId/comments",authMiddleware,postComment);
router.post("/suggestedMovie/:movieId/vote",authMiddleware,postVote);
router.get("/getUserMovies",authMiddleware,getUserMovies);
router.delete("/suggestedMovie/:movieId",authMiddleware, deleteMovie);
router.delete("/suggestedMovie/:movieId/comments/:commentId",authMiddleware, deleteComment);

export default router;




