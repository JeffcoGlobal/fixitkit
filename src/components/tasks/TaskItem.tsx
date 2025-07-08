import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import { 
  Check, 
  Clock, 
  Flag, 
  MoreVertical, 
  Edit3, 
  Trash2,
  Calendar
} from 'lucide-react'
import { Task, useTasks } from '../../hooks/useTasks'
import { Modal } from '../ui/Modal'
import { TaskForm } from './TaskForm'

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTasks()
  const [showMenu, setShowMenu] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleToggleComplete = () => {
    toggleTask(task.id, !task.completed)
  }

  const handleDelete = async () => {
    await deleteTask(task.id)
    setShowDeleteModal(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'low':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getDueDateInfo = (dueDate: string | null) => {
    if (!dueDate) return null

    const date = new Date(dueDate)
    const isPastDue = isPast(date) && !isToday(date)
    
    let dateText = format(date, 'MMM d')
    if (isToday(date)) dateText = 'Today'
    else if (isTomorrow(date)) dateText = 'Tomorrow'

    return {
      text: dateText,
      isPastDue,
      isToday: isToday(date),
      isTomorrow: isTomorrow(date)
    }
  }

  const dueDateInfo = getDueDateInfo(task.due_date)

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`task-item ${task.completed ? 'completed' : ''}`}
      >
        <div className="flex items-start space-x-3">
          <button
            onClick={handleToggleComplete}
            className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              task.completed
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
            }`}
          >
            {task.completed && <Check className="w-3 h-3" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`text-sm font-medium transition-all duration-200 ${
                  task.completed 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className={`mt-1 text-sm transition-all duration-200 ${
                    task.completed ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}

                <div className="flex items-center space-x-3 mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    <Flag className="w-3 h-3 mr-1" />
                    {task.priority}
                  </span>

                  {dueDateInfo && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      dueDateInfo.isPastDue 
                        ? 'text-red-600 bg-red-50' 
                        : dueDateInfo.isToday 
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 bg-gray-50'
                    }`}>
                      <Calendar className="w-3 h-3 mr-1" />
                      {dueDateInfo.text}
                    </span>
                  )}

                  <span className="text-xs text-gray-400">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {format(new Date(task.created_at), 'MMM d')}
                  </span>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                  >
                    <button
                      onClick={() => {
                        setShowEditModal(true)
                        setShowMenu(false)
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Task
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteModal(true)
                        setShowMenu(false)
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Task
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Task"
        maxWidth="lg"
      >
        <TaskForm task={task} onClose={() => setShowEditModal(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Task"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{task.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger"
            >
              Delete Task
            </button>
          </div>
        </div>
      </Modal>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  )
}