import { NextRequest } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import { authenticate } from "@/lib/utils/auth";
import {
  successResponse,
  asyncHandler,
} from "@/lib/middlewares/api-middleware";

export const GET = asyncHandler(async (req: NextRequest) => {
  await connectDB();

  // Authenticate user
  const decoded = await authenticate(req);

  // Get user data
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Return user data
  return successResponse({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});
