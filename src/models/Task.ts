import mongoose, { Document, Model, Schema } from "mongoose";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "completed";

export interface ITask extends Document {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new mongoose.Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "{VALUE} is not supported as priority",
      },
      default: "medium",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "completed"],
        message: "{VALUE} is not supported as status",
      },
      default: "pending",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient queries by user and other fields
TaskSchema.index({ user: 1, status: 1 });
TaskSchema.index({ user: 1, priority: 1 });
TaskSchema.index({ user: 1, createdAt: -1 });

// Delete model if it exists to prevent overwrite error in development
const TaskModel: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default TaskModel;
