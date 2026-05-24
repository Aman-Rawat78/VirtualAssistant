import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {
    console.log("Checking authentication...");
    console.log("Cookies received:", req.cookies);
    const token = req.cookies.token;
    console.log("Token from cookies:", token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
