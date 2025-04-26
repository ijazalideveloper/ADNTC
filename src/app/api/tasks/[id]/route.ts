import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongodb";
import Task from "@/models/Task";
import { authenticate } from "@/lib/utils/auth";
import {
  successResponse,
  errorResponse,
  methodHandler,
} from "@/lib/middlewares/api-middleware";

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper function to get a task and ensure it belongs to the current user
async function getUserTask(taskId: string, userId: string) {
  // Validate taskId format
  if (!isValidObjectId(taskId)) {
    throw new Error("Invalid task ID format");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  // Check if task belongs to user
  if (task.user.toString() !== userId) {
    throw new Error("Permission denied: Not authorized to access this task");
  }

  return task;
}

// Handler for GET /api/tasks/[id] (Get task by ID)
async function getTaskById(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  // Authenticate user
  const decoded = await authenticate(req);

  // Get task ID from URL parameters
  const taskId = params.id;

  // Get task and verify ownership
  const task = await getUserTask(taskId, decoded.userId);

  return successResponse({ task });
}

// Handler for PUT /api/tasks/[id] (Update task by ID)
async function updateTask(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  // Authenticate user
  const decoded = await authenticate(req);

  // Get task ID from URL parameters
  const taskId = params.id;

  // Get updated data from request body
  const body = await req.json();
  const { title, description, priority, status } = body;

  // Validate required fields
  if (!title) {
    return errorResponse("Title is required", 400);
  }

  // Get task and verify ownership
  await getUserTask(taskId, decoded.userId);

  // Update task
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      title,
      description,
      priority,
      status,
    },
    { new: true, runValidators: true }
  );

  return successResponse({ task: updatedTask });
}

// Handler for PATCH /api/tasks/[id] (Partially update task by ID)
async function patchTask(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  // Authenticate user
  const decoded = await authenticate(req);

  // Get task ID from URL parameters
  const taskId = params.id;

  // Get updated data from request body
  const updates = await req.json();

  // Get task and verify ownership
  await getUserTask(taskId, decoded.userId);

  // Update task with partial data
  const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
    new: true,
    runValidators: true,
  });

  return successResponse({ task: updatedTask });
}

// Handler for DELETE /api/tasks/[id] (Delete task by ID)
async function deleteTask(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  // Authenticate user
  const decoded = await authenticate(req);

  // Get task ID from URL parameters
  const taskId = params.id;

  // Get task and verify ownership
  await getUserTask(taskId, decoded.userId);

  // Delete task
  await Task.findByIdAndDelete(taskId);

  return successResponse({ message: "Task deleted successfully" });
}

// Export route handlers
export const GET = methodHandler({ GET: getTaskById });
export const PUT = methodHandler({ PUT: updateTask });
export const PATCH = methodHandler({ PATCH: patchTask });
export const DELETE = methodHandler({ DELETE: deleteTask });
