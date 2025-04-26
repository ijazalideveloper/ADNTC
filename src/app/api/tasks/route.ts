import { NextRequest } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Task from "@/models/Task";
import { authenticate } from "@/lib/utils/auth";
import {
  successResponse,
  methodHandler,
} from "@/lib/middlewares/api-middleware";

// Handler for GET /api/tasks (Get all tasks for the current user)
async function getTasks(req: NextRequest) {
  await connectDB();

  // Authenticate user
  const decoded = await authenticate(req);

  // Get query parameters
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const priority = url.searchParams.get("priority");
  const sortBy = url.searchParams.get("sortBy") || "createdAt_desc";

  // Build query
  const query: any = { user: decoded.userId };

  if (status && status !== "all") {
    query.status = status;
  }

  if (priority && priority !== "all") {
    query.priority = priority;
  }

  // Determine sort options
  let sort: any = { createdAt: -1 }; // default: newest first

  if (sortBy === "createdAt_asc") {
    sort = { createdAt: 1 };
  } else if (sortBy === "priority_high") {
    // Custom sort for priority high to low
    // MongoDB can't directly sort by enum values as we want
    // So we'll sort after fetching
    sort = {}; // No sorting at query time
  } else if (sortBy === "priority_low") {
    // Same as above
    sort = {}; // No sorting at query time
  }

  // Get tasks from database
  let tasks = await Task.find(query).sort(sort);

  // Manual sorting for priority if needed
  if (sortBy === "priority_high" || sortBy === "priority_low") {
    const priorityOrder = { high: 0, medium: 1, low: 2 };

    tasks = tasks.sort((a, b) => {
      const orderA = priorityOrder[a.priority as keyof typeof priorityOrder];
      const orderB = priorityOrder[b.priority as keyof typeof priorityOrder];

      return sortBy === "priority_high" ? orderA - orderB : orderB - orderA;
    });
  }

  return successResponse({ tasks });
}

// Handler for POST /api/tasks (Create a new task)
async function createTask(req: NextRequest) {
  await connectDB();

  // Authenticate user
  const decoded = await authenticate(req);

  // Get task data from request body
  const body = await req.json();
  const { title, description, priority, status } = body;

  // Validate required fields
  if (!title) {
    throw new Error("Title is required");
  }

  // Create new task
  const task = await Task.create({
    title,
    description: description || "",
    priority: priority || "medium",
    status: status || "pending",
    user: decoded.userId,
  });

  return successResponse({ task }, 201);
}

// Export route handlers
export const GET = methodHandler({ GET: getTasks });
export const POST = methodHandler({ POST: createTask });
