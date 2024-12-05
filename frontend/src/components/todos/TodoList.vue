<template>
  <div class="max-w-5xl mx-auto p-6">
    <!-- Header with Add Button -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">
        Super-Todo List 
        <!-- Display role -->
        (<span class="px-2 py-1 rounded" :class="userRole === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
        {{ userRole.toUpperCase() }}
        </span>)
      </h2>
      <button 
        @click="openAddModal"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <span>Add Todo +</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
    </div>

    <!-- Todo List Container -->
    <div class="bg-white rounded-lg shadow">
      <!-- Empty State -->
      <div v-if="!todos.length" class="p-8 text-center">
        <div class="text-gray-500 mb-2">You have no todos yet!</div>
        <button 
          @click="openAddModal"
          class="text-blue-500 hover:text-blue-700"
        >
          + Add your first todo
        </button>
      </div>

      <!-- Todo List -->
      <div v-else class="divide-y divide-gray-200">
        <div v-for="todo in todos" :key="todo.id" class="p-4">
          <!-- Todo Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                :checked="todo.completed"
                @change="toggleTodo(todo)"
                class="h-4 w-4 text-blue-500 rounded border-gray-300"
              >
              <span class="ml-3" :class="{ 'line-through text-gray-400': todo.completed }">
                {{ todo.title }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">
                {{ new Date(todo.createdAt).toLocaleString() }}
              </span>
              <button 
                @click="openEditModal(todo)"
                class="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button 
                @click="openDeleteModal(todo)"
                class="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
          
          <!-- Notes Section (Paid Users Only) -->
          <div v-if="userRole === 'paid'" class="mt-2">
            <div class="text-sm text-gray-500 mt-2">Notes:</div>
            <div class="mt-1 relative">
              <textarea
                v-model="todo.notes"
                rows="2"
                class="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                placeholder="Add notes..."
                @blur="updateTodoNotes(todo)"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingTodo ? 'Edit Todo' : 'Add New Todo' }}
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Title</label>
              <input
                v-model="todoTitle"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Enter todo title"
              >
            </div>
            
            <!-- Notes field (Paid Users Only) -->
            <div v-if="userRole === 'paid'">
              <label class="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                v-model="todoNotes"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Add notes (optional)"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-3 flex justify-end gap-2">
          <button 
            @click="closeModal"
            class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            @click="saveTodo"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {{ editingTodo ? 'Save' : 'Add' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Delete Todo</h3>
          <p class="text-gray-500">Are you sure you want to delete this todo?</p>
        </div>
        <div class="bg-gray-50 px-6 py-3 flex justify-end gap-2">
          <button 
            @click="closeDeleteModal"
            class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            @click="confirmDelete"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { Todo } from '@/types/todo'

// State
const todos = ref<Todo[]>([])
const loading = ref(true)
const showModal = ref(false)
const showDeleteModal = ref(false)
const todoTitle = ref('')
const todoNotes = ref('')
const editingTodo = ref<Todo | null>(null)
const todoToDelete = ref<Todo | null>(null)
const userRole = ref<'free' | 'paid'>('free')

//const API_URL = 'http://localhost:3009/todos'
const API_URL = import.meta.env.VITE_TODO_API_URL

// Load todos
const loadTodos = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${API_URL}?userRole=${userRole.value}`)
    todos.value = response.data
  } catch (err) {
    console.error('Failed to load todos:', err)
  } finally {
    loading.value = false
  }
}

// Toggle todo
const toggleTodo = async (todo: Todo) => {
  try {
    await axios.put(`${API_URL}/${todo.id}?userRole=${userRole.value}`, {
      ...todo,
      completed: !todo.completed
    })
    await loadTodos()
  } catch (err) {
    console.error('Failed to update todo:', err)
  }
}

// Update todo notes (paid users only)
const updateTodoNotes = async (todo: Todo) => {
  if (userRole.value !== 'paid') return
  
  try {
    await axios.put(`${API_URL}/${todo.id}?userRole=${userRole.value}`, todo)
  } catch (err) {
    console.error('Failed to update notes:', err)
  }
}

// Modal handlers
const openAddModal = () => {
  editingTodo.value = null
  todoTitle.value = ''
  todoNotes.value = ''
  showModal.value = true
}

const openEditModal = (todo: Todo) => {
  editingTodo.value = todo
  todoTitle.value = todo.title
  todoNotes.value = todo.notes || ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingTodo.value = null
  todoTitle.value = ''
  todoNotes.value = ''
}

const openDeleteModal = (todo: Todo) => {
  todoToDelete.value = todo
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  todoToDelete.value = null
}

// Save todo
const saveTodo = async () => {
  if (!todoTitle.value.trim()) return

  const todoData = {
    title: todoTitle.value,
    ...(userRole.value === 'paid' && { notes: todoNotes.value }),
    completed: false
  }

  try {
    // Check if modal is update
    if (editingTodo.value) {
      await axios.put(
        `${API_URL}/${editingTodo.value.id}?userRole=${userRole.value}`,
        { ...editingTodo.value, ...todoData }
      )
    } else { // Else then insert
      await axios.post(`${API_URL}?userRole=${userRole.value}`, todoData)
    }
    await loadTodos()
    closeModal()
  } catch (err) {
    console.error('Failed to save todo:', err)
  }
}

// Delete todo
const confirmDelete = async () => {
  if (!todoToDelete.value) return

  try {
    await axios.delete(
      `${API_URL}/${todoToDelete.value.id}?userRole=${userRole.value}`
    )
    await loadTodos()
    closeDeleteModal()
  } catch (err) {
    console.error('Failed to delete todo:', err)
  }
}

// Get user role from URL and load todos
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const role = params.get('userRole')
  userRole.value = role === 'paid' ? 'paid' : 'free'
  loadTodos()
})
</script>