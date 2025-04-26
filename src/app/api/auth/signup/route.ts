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
  const { name, email, password, confirmPassword } = body;

  // Basic validation
  if (!name || !email || !password) {
    return errorResponse("Please provide all required fields", 400);
  }

  if (password !== confirmPassword) {
    return errorResponse("Passwords do not match", 400);
  }

  if (password.length < 8) {
    return errorResponse("Password must be at least 8 characters long", 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return errorResponse("Email already in use", 409);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password, // Will be hashed by the pre-save hook in the model
  });

  // Generate token
  const token = createToken(user);

  // Return user data (without password) and token
  return successResponse(
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    },
    201
  );
});
