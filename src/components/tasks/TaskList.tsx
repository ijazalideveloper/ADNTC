import React, { useState, useEffect } from "react";
import TaskItem from "./TaskItem";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import TaskForm from "./TaskForm";
import Select from "@/components/ui/Select";
import { Task, TaskPriority, TaskStatus } from "@/lib/types";
import styles from "@/styles/components/_tasks.module.scss";

interface TaskListProps {
  tasks: Task[];
  onCreateTask: (
    task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">
  ) => void;
  onUpdateTask: (taskId: string, task: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  isLoading?: boolean;
}

type SortOption =
  | "createdAt_desc"
  | "createdAt_asc"
  | "priority_high"
  | "priority_low";

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  isLoading = false,
}) => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<SortOption>("createdAt_desc");

  // Apply filters and sorting whenever tasks or filter/sort options change
  useEffect(() => {
    let result = [...tasks];

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((task) => task.status === filterStatus);
    }

    // Apply priority filter
    if (filterPriority !== "all") {
      result = result.filter((task) => task.priority === filterPriority);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "createdAt_desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "createdAt_asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "priority_high": {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case "priority_low": {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        default:
          return 0;
      }
    });

    setFilteredTasks(result);
  }, [tasks, filterStatus, filterPriority, sortBy]);

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setCurrentTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    onUpdateTask(taskId, { status: newStatus });
  };

  const statusFilterOptions = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
  ];

  const priorityFilterOptions = [
    { label: "All", value: "all" },
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];

  const sortOptions = [
    { label: "Newest First", value: "createdAt_desc" },
    { label: "Oldest First", value: "createdAt_asc" },
    { label: "Priority (High to Low)", value: "priority_high" },
    { label: "Priority (Low to High)", value: "priority_low" },
  ];

  return (
    <div className={styles.tasksContainer}>
      <div className={styles.taskListHeader}>
        <h1>My Tasks</h1>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="20"
              height="20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          }
        >
          Add New Task
        </Button>
      </div>

      <div className={styles.taskControls}>
        <div className={styles.taskFilters}>
          <Select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as TaskStatus | "all")
            }
            options={statusFilterOptions}
            fullWidth={false}
          />

          <Select
            id="priorityFilter"
            value={filterPriority}
            onChange={(e) =>
              setFilterPriority(e.target.value as TaskPriority | "all")
            }
            options={priorityFilterOptions}
            fullWidth={false}
          />

          <Select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            options={sortOptions}
            fullWidth={false}
          />
        </div>

        <div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "task" : "tasks"} found
          </p>
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className={styles.tasksList}>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={() => handleEditTask(task)}
              onDelete={() => handleDeleteTask(task)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.icon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="64"
              height="64"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3>No tasks found</h3>
          <p>
            {filterStatus !== "all" || filterPriority !== "all"
              ? "Try adjusting your filters to see more tasks"
              : "Create your first task to get started"}
          </p>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="20"
                height="20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
          >
            Create New Task
          </Button>
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={(taskData) => {
            onCreateTask(taskData);
            setIsCreateModalOpen(false);
          }}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* Edit Task Modal */}
      {currentTask && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Task"
        >
          <TaskForm
            initialData={currentTask}
            onSubmit={(taskData) => {
              onUpdateTask(currentTask.id, taskData);
              setIsEditModalOpen(false);
            }}
            onCancel={() => setIsEditModalOpen(false)}
            isLoading={isLoading}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {currentTask && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Task"
        >
          <div>
            <p>
              Are you sure you want to delete the task "{currentTask.title}"?
            </p>
            <p>This action cannot be undone.</p>

            <div className={styles.formActions}>
              <Button
                variant="outlined"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onDeleteTask(currentTask.id);
                  setIsDeleteModalOpen(false);
                }}
                isLoading={isLoading}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TaskList;
