// middleware/auth.js
import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id , role: decoded.role };
    
    } catch (err) {
      console.warn("Invalid token, continuing as guest");
      req.user = null;
    }
  } else {
    req.user = null; // guest user
  }

  next();
}


export const isAdmin = (req,res,next)=> {
  if(req.user && req.user.role === 'admin'){
    next();
  } else {
    res.status(403).json({ message: "admin access" });
  }
}