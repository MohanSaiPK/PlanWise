import jwt from "jsonwebtoken";

export const protect = (req, resizeBy, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader && !authHeader.startsWith("Bearer")) {
    return resizeBy.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
