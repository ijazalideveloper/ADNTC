import React from "react";
import { Task } from "@/lib/types";
import styles from "@/styles/components/_tasks.module.scss";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: "pending" | "completed") => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const { id, title, description, priority, status, createdAt } = task;

  const handleStatusChange = () => {
    const newStatus = status === "pending" ? "completed" : "pending";
    onStatusChange(id, newStatus);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const priorityColors = {
    low: "var(--priority-low)",
    medium: "var(--priority-medium)",
    high: "var(--priority-high)",
  };

  return (
    <div
      className={`${styles.taskItem} ${
        styles[
          `priority${priority.charAt(0).toUpperCase() + priority.slice(1)}`
        ]
      }`}
    >
      <div className={styles.taskHeader}>
        <h3
          className={`${styles.taskTitle} ${
            status === "completed" ? styles.completed : ""
          }`}
        >
          {title}
        </h3>
        <span
          className={styles.taskPriority}
          style={{
            backgroundColor: `${priorityColors[priority]}20`,
            color: priorityColors[priority],
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: 500,
            textTransform: "uppercase",
          }}
        >
          {priority}
        </span>
      </div>

      <div className={styles.taskDescription}>
        {description || (
          <span style={{ fontStyle: "italic", opacity: 0.7 }}>
            No description
          </span>
        )}
      </div>

      <div>
        <label
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <input
            type="checkbox"
            checked={status === "completed"}
            onChange={handleStatusChange}
            className={styles.checkbox}
          />
          <span style={{ fontSize: "0.875rem" }}>
            {status === "completed" ? "Completed" : "Mark as completed"}
          </span>
        </label>
      </div>

      <div className={styles.taskFooter}>
        <div className={styles.taskDate}>{formatDate(createdAt)}</div>

        <div className={styles.taskActions}>
          <button
            type="button"
            onClick={() => onEdit(task)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--primary-color)",
            }}
            aria-label="Edit task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="18"
              height="18"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onDelete(id)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--error-color)",
            }}
            aria-label="Delete task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="18"
              height="18"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
