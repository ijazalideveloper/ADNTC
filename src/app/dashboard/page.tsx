"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TaskList from "@/components/tasks/TaskList";
import useAuth from "@/lib/hooks/useAuth";
import { api } from "@/lib/utils/api";
import { Task } from "@/lib/types";
import styles from "@/styles/layouts/_layout.module.scss";

const Dashboard: React.FC = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
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
      // In a real app, this would be an API call
      // For demonstration, use mock data
      // const response = await api.get<Task[]>('/tasks');

      // Mock response with sample data
      const mockTasks: Task[] = [
        {
          id: "1",
          userId: user?.id || "1",
          title: "Complete project documentation",
          description:
            "Write comprehensive documentation for the Task Manager project, including API endpoints and component usage.",
          priority: "high",
          status: "pending",
          createdAt: new Date("2025-04-20T10:00:00"),
          updatedAt: new Date("2025-04-20T10:00:00"),
        },
        {
          id: "2",
          userId: user?.id || "1",
          title: "Fix login page responsiveness",
          description:
            "The login page is not displaying correctly on mobile devices. Need to adjust the layout for smaller screens.",
          priority: "medium",
          status: "pending",
          createdAt: new Date("2025-04-22T14:30:00"),
          updatedAt: new Date("2025-04-22T14:30:00"),
        },
        {
          id: "3",
          userId: user?.id || "1",
          title: "Weekly team meeting",
          description:
            "Prepare agenda for the weekly team meeting and share it with team members.",
          priority: "low",
          status: "completed",
          createdAt: new Date("2025-04-23T09:15:00"),
          updatedAt: new Date("2025-04-24T11:45:00"),
        },
      ];

      // Simulate API response delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTasks(mockTasks);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again later.");
      setLoading(false);
    }
  };

  const handleCreateTask = async (
    taskData: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    setLoading(true);

    try {
      // In a real app, this would be an API call
      // For demonstration, create a mock task with a new ID
      const newTask: Task = {
        id: `task-${Date.now()}`,
        userId: user?.id || "1",
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTasks((prevTasks) => [...prevTasks, newTask]);
      setLoading(false);
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Failed to create task. Please try again later.");
      setLoading(false);
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    updatedData: Partial<Task>
  ) => {
    setLoading(true);

    try {
      // In a real app, this would be an API call
      // For demonstration, update the task in the local state

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, ...updatedData, updatedAt: new Date() }
            : task
        )
      );

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
      // In a real app, this would be an API call
      // For demonstration, remove the task from the local state

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setLoading(false);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task. Please try again later.");
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageDescription}>
          Manage your tasks efficiently. Create, edit, and track all your tasks
          in one place.
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
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        isLoading={loading}
      />
    </div>
  );
};

export default Dashboard;
