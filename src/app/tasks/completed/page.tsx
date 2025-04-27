"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TaskList from "@/components/tasks/TaskList";
import useAuth from "@/lib/hooks/useAuth";
import { tasksApi } from "@/lib/utils/api";
import { Task } from "@/lib/types";
import styles from "@/styles/layouts/_layout.module.scss";

export default function CompletedTasksPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch tasks when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      // Directly fetch only completed tasks from API
      const response = await tasksApi.getAllTasks({ status: "completed" });

      if (response.success && response.data) {
        // Format the dates properly
        const formattedTasks = response.data.tasks.map((task) => ({
          ...task,
          // Safely handle date conversion
          createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
          updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
          // Ensure the id field exists
          id: task.id || (task._id ? task._id.toString() : ""),
        }));

        setTasks(formattedTasks);
      } else {
        setError(response.error || "Failed to load completed tasks");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching completed tasks:", err);
      setError("Failed to load completed tasks. Please try again later.");
      setLoading(false);
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    updatedData: Partial<Task>
  ) => {
    setLoading(true);

    try {
      // If status is changed to 'pending', task should be removed from this view
      if (updatedData.status === "pending") {
        const response = await tasksApi.updateTaskStatus(taskId, "pending");

        if (response.success) {
          // Remove task from list since it's no longer completed
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== taskId)
          );
        } else {
          setError(response.error || "Failed to update task");
        }
      } else {
        // For other updates where status remains 'completed'
        const currentTask = tasks.find((task) => task.id === taskId);

        if (!currentTask) {
          setError("Task not found");
          setLoading(false);
          return;
        }

        const response = await tasksApi.updateTask(taskId, {
          title: updatedData.title || currentTask.title,
          description:
            updatedData.description !== undefined
              ? updatedData.description
              : currentTask.description,
          priority: updatedData.priority || currentTask.priority,
          status: "completed", // Ensure status remains completed
        });

        if (response.success && response.data) {
          // Update task in local state
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    ...updatedData,
                    status: "completed", // Force status to remain completed
                    updatedAt:
                    response && response?.data && response?.data?.task && response?.data?.task?.updatedAt
                        ? new Date(response.data.task.updatedAt)
                        : new Date(),
                  }
                : task
            )
          );
        } else {
          setError(response.error || "Failed to update task");
        }
      }

      setLoading(false);
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task. Please try again later.");
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setLoading(true);

    try {
      const response = await tasksApi.deleteTask(taskId);

      if (response.success) {
        // Remove task from local state
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } else {
        setError(response.error || "Failed to delete task");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task. Please try again later.");
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Completed Tasks</h1>
        <p className={styles.pageDescription}>
          View all your completed tasks. You can reopen tasks or delete them
          permanently.
        </p>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "rgb(239, 68, 68)",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          {error}
        </div>
      )}

      <TaskList
        tasks={tasks}
        onCreateTask={undefined} // Disable task creation in completed tasks view
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        isLoading={loading}
        // Default filter to show only completed tasks
        defaultFilters={{
          status: "completed",
          priority: "all",
          sortBy: "updatedAt_desc",
        }}
        disableStatusFilter={true} // Don't allow changing the status filter
      />
    </div>
  );
}
