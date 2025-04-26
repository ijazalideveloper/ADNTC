'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskList from '@/components/tasks/TaskList';
import useAuth from '@/lib/hooks/useAuth';
import { tasksApi } from '@/lib/utils/api';
import { Task } from '@/lib/types';
import styles from '@/styles/layouts/_layout.module.scss';

export default function Dashboard() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
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
      const response = await tasksApi?.getAllTasks();
      
      if (response.success && response.data) {
        // Format the dates properly
        const formattedTasks = response?.data?.tasks?.map(task => ({
          ...task,
          // Safely handle date conversion
          createdAt: task?.createdAt ? new Date(task?.createdAt) : new Date(),
          updatedAt: task?.updatedAt ? new Date(task?.updatedAt) : new Date(),
          // Ensure the id field exists
          id: task?.id || ((task as any)?._id ? (task as any)._id.toString() : ''),
        }));
        
        setTasks(formattedTasks);
      } else {
        setError(response.error || 'Failed to load tasks');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'user' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    
    try {
      const response = await tasksApi.createTask({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
      });
      
      if (response.success && response.data) {
        // Format the new task
        const newTask = {
          ...response.data.task,
          createdAt: response.data.task.createdAt ? new Date(response.data.task.createdAt) : new Date(),
          updatedAt: response.data.task.updatedAt ? new Date(response.data.task.updatedAt) : new Date(),
          id: response.data.task.id || (response.data.task._id ? response.data.task._id.toString() : ''),
        };
        
        // Add the new task to the list
        setTasks(prevTasks => [...prevTasks, newTask]);
        setLoading(false);
      } else {
        setError(response.error || 'Failed to create task');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again later.');
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskId: string, updatedData: Partial<Task>) => {
    setLoading(true);
    
    try {
      // If only status is being updated, use updateTaskStatus method
      if (Object.keys(updatedData).length === 1 && 'status' in updatedData) {
        const response = await tasksApi.updateTaskStatus(taskId, updatedData.status as string);
        
        if (response.success && response.data) {
          // Update task in local state with safe date handling
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    ...updatedData,
                    updatedAt: response.data && response.data.task && response.data.task.updatedAt 
                      ? new Date(response.data.task.updatedAt) 
                      : new Date(),
                  }
                : task
            )
          );
        } else {
          setError(response.error || 'Failed to update task');
        }
      } else {
        // For more comprehensive updates, use updateTask method
        const currentTask = tasks.find(task => task.id === taskId);
        
        if (!currentTask) {
          setError('Task not found');
          setLoading(false);
          return;
        }
        
        const response = await tasksApi.updateTask(taskId, {
          title: updatedData.title || currentTask.title,
          description: updatedData.description !== undefined ? updatedData.description : currentTask.description,
          priority: updatedData.priority || currentTask.priority,
          status: updatedData.status || currentTask.status,
        });
        
        if (response.success && response.data) {
          // Update task in local state with safe date handling
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    ...updatedData,
                    updatedAt: response.data && response.data.task && response.data.task.updatedAt 
                      ? new Date(response.data.task.updatedAt) 
                      : new Date(),
                  }
                : task
            )
          );
        } else {
          setError(response.error || 'Failed to update task');
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again later.');
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setLoading(true);
    
    try {
      const response = await tasksApi.deleteTask(taskId);
      
      if (response.success) {
        // Remove task from local state
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      } else {
        setError(response.error || 'Failed to delete task');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again later.');
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
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageDescription}>
          Manage your tasks efficiently. Create, edit, and track all your tasks in one place.
        </p>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          color: 'rgb(239, 68, 68)',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
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
}