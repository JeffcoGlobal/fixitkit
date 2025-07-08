import { useState, useEffect } from 'react'
import { supabase, Tables } from '../lib/supabase'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export type Task = Tables<'tasks'>

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchTasks()
      
      // Subscribe to real-time changes
      const subscription = supabase
        .channel('tasks')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'tasks',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setTasks(prev => [...prev, payload.new as Task])
            } else if (payload.eventType === 'UPDATE') {
              setTasks(prev => prev.map(task => 
                task.id === payload.new.id ? payload.new as Task : task
              ))
            } else if (payload.eventType === 'DELETE') {
              setTasks(prev => prev.filter(task => task.id !== payload.old.id))
            }
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [user])

  const fetchTasks = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error: any) {
      toast.error('Failed to fetch tasks')
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      toast.success('Task created successfully!')
      return data
    } catch (error: any) {
      toast.error('Failed to create task')
      console.error('Error creating task:', error)
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      toast.success('Task updated successfully!')
      return data
    } catch (error: any) {
      toast.error('Failed to update task')
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Task deleted successfully!')
    } catch (error: any) {
      toast.error('Failed to delete task')
      console.error('Error deleting task:', error)
    }
  }

  const toggleTask = async (id: string, completed: boolean) => {
    await updateTask(id, { completed })
  }

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    refetch: fetchTasks,
  }
}