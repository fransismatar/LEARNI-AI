import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface JwtPayload {
  userId?: string;
  id?: string;
  _id?: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("AUTH CHECK:", req.method, req.originalUrl);

    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER EXISTS:", !!authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("AUTH FAIL: NO BEARER TOKEN");
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("TOKEN START:", token.slice(0, 12));

    console.log("JWT_SECRET EXISTS:", !!process.env.JWT_SECRET);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    console.log("DECODED:", decoded);

    const userId = decoded.userId || decoded.id || decoded._id;
    console.log("USER ID:", userId);

    if (!userId) {
      console.log("AUTH FAIL: NO USER ID IN TOKEN");
      return res.status(401).json({
        message: "Not authorized, invalid token payload",
      });
    }

    const user = await User.findById(userId).select("-password");
    console.log("USER FOUND:", !!user);

    if (!user) {
      console.log("AUTH FAIL: USER NOT FOUND");
      return res.status(401).json({
        message: "User not found",
      });
    }

    (req as any).user = user;

    next();
  } catch (error: any) {
    console.log("AUTH ERROR NAME:", error?.name);
    console.log("AUTH ERROR MESSAGE:", error?.message);

    return res.status(401).json({
      message: "Not authorized, token failed",
      errorName: error?.name,
      errorMessage: error?.message,
    });
  }
};