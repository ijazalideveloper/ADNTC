"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/lib/hooks/useAuth";
import { tasksApi } from "@/lib/utils/api";
import { Task, TaskPriority } from "@/lib/types";
import styles from "@/styles/layouts/_layout.module.scss";

export default function AnalyticsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0,
    priorityDistribution: {
      high: 0,
      medium: 0,
      low: 0,
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch tasks and calculate analytics when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await tasksApi.getAllTasks();

      if (response.success && response.data) {
        // Format the tasks
        const formattedTasks = response.data.tasks.map((task) => ({
          ...task,
          createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
          updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
          id: task.id || (task._id ? task._id.toString() : ""),
        }));

        setTasks(formattedTasks);
        calculateAnalytics(formattedTasks);
      } else {
        setError(response.error || "Failed to load tasks");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again later.");
      setLoading(false);
    }
  };

  const calculateAnalytics = (tasks: Task[]) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Calculate priority distribution
    const priorityDistribution = {
      high: 0,
      medium: 0,
      low: 0,
    };

    tasks.forEach((task) => {
      priorityDistribution[task.priority]++;
    });

    setAnalytics({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      priorityDistribution,
    });
  };

  if (authLoading || loading) {
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
        <h1 className={styles.pageTitle}>Analytics</h1>
        <p className={styles.pageDescription}>
          Get insights into your task management performance and habits.
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

      <div
        className="analytics-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Task Count Card */}
        <div
          className="analytics-card"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginBottom: "10px", fontSize: "18px" }}>Task Count</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "32px",
              fontWeight: "bold",
              color: "#2563eb",
            }}
          >
            <div>{analytics.totalTasks}</div>
            <div
              style={{
                fontSize: "14px",
                color: "#64748b",
                alignSelf: "flex-end",
              }}
            >
              Total Tasks
            </div>
          </div>
        </div>

        {/* Completion Rate Card */}
        <div
          className="analytics-card"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginBottom: "10px", fontSize: "18px" }}>
            Completion Rate
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "32px",
              fontWeight: "bold",
              color: analytics.completionRate > 50 ? "#22c55e" : "#f59e0b",
            }}
          >
            <div>{analytics.completionRate.toFixed(1)}%</div>
            <div
              style={{
                fontSize: "14px",
                color: "#64748b",
                alignSelf: "flex-end",
              }}
            >
              Tasks Completed
            </div>
          </div>
        </div>

        {/* Tasks by Status Card */}
        <div
          className="analytics-card"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginBottom: "10px", fontSize: "18px" }}>
            Tasks by Status
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#22c55e",
                }}
              >
                {analytics.completedTasks}
              </div>
              <div style={{ fontSize: "14px", color: "#64748b" }}>
                Completed
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#f59e0b",
                }}
              >
                {analytics.pendingTasks}
              </div>
              <div style={{ fontSize: "14px", color: "#64748b" }}>Pending</div>
            </div>
          </div>
        </div>

        {/* Tasks by Priority Card */}
        <div
          className="analytics-card"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginBottom: "10px", fontSize: "18px" }}>
            Tasks by Priority
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#ef4444",
                }}
              >
                {analytics.priorityDistribution.high}
              </div>
              <div style={{ fontSize: "14px", color: "#64748b" }}>High</div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#f59e0b",
                }}
              >
                {analytics.priorityDistribution.medium}
              </div>
              <div style={{ fontSize: "14px", color: "#64748b" }}>Medium</div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#22c55e",
                }}
              >
                {analytics.priorityDistribution.low}
              </div>
              <div style={{ fontSize: "14px", color: "#64748b" }}>Low</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className="analytics-card"
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>
          Recent Activity
        </h3>

        {tasks.length > 0 ? (
          <div className="recent-tasks">
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: "bold" }}>{task.title}</div>
                  <div style={{ fontSize: "14px", color: "#64748b" }}>
                    {task.status === "completed" ? "Completed" : "Pending"} -
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}{" "}
                    Priority
                  </div>
                </div>
                <div style={{ fontSize: "14px", color: "#64748b" }}>
                  {task.updatedAt.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{ textAlign: "center", padding: "20px", color: "#64748b" }}
          >
            No tasks to display
          </div>
        )}
      </div>

      {/* Productivity Tips */}
      <div
        className="analytics-card"
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>
          Productivity Tips
        </h3>
        <ul style={{ paddingLeft: "20px" }}>
          <li style={{ marginBottom: "10px" }}>
            Focus on high-priority tasks first to maximize impact.
          </li>
          <li style={{ marginBottom: "10px" }}>
            Break down large tasks into smaller, manageable steps.
          </li>
          <li style={{ marginBottom: "10px" }}>
            Set realistic deadlines to avoid burnout and maintain quality.
          </li>
          <li style={{ marginBottom: "10px" }}>
            Review completed tasks to learn and improve your process.
          </li>
          <li style={{ marginBottom: "10px" }}>
            Take regular breaks to maintain focus and productivity.
          </li>
        </ul>
      </div>
    </div>
  );
}
