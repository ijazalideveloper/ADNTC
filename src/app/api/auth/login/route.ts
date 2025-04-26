import { NextRequest } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import { createToken } from "@/lib/utils/auth";
import {
  successResponse,
  errorResponse,
  asyncHandler,
} from "@/lib/middlewares/api-middleware";

export const POST = asyncHandler(async (req: NextRequest) => {
  await connectDB();

  const body = await req.json();
  const { email, password } = body;

  // Basic validation
  if (!email || !password) {
    return errorResponse("Please provide email and password", 400);
  }

  // Find user with password included
  const user = await User.findOne({ email }).select("+password");

  // Check if user exists
  if (!user) {
    return errorResponse("Invalid credentials", 401);
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return errorResponse("Invalid credentials", 401);
  }

  // Generate token
  const token = createToken(user);

  // Return user data (without password) and token
  return successResponse({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});
