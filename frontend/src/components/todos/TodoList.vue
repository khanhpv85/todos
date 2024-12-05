<template>
  <div class="max-w-5xl mx-auto p-6">
    <!-- Header with Add Button -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">
        Super-Todo List 
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
        <TodoItem
          v-for="todo in todos"
          :key="todo.id"
          :todo="todo"
          :user-role="userRole"
          @toggle="toggleTodo"
          @edit="openEditModal"
          @delete="openDeleteModal"
          @update-notes="updateTodoNotes"
        />
      </div>
    </div>

    <TodoForm
      v-if="showModal"
      :todo="editingTodo"
      :user-role="userRole"
      @save="saveTodo"
      @close="closeModal"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Delete Todo</h3>
          <p class="text-gray-500">Are you sure delete this todo?</p>
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
  import TodoItem from './TodoItem.vue'
  import TodoForm from './TodoForm.vue'

  // State
  const todos = ref<Todo[]>([])
  const loading = ref(true)
  const showModal = ref(false)
  const showDeleteModal = ref(false)
  const editingTodo = ref<Todo | null>(null)
  const todoToDelete = ref<Todo | null>(null)
  const userRole = ref<'free' | 'paid'>('free')

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

  // Update todo notes
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
    showModal.value = true
  }

  const openEditModal = (todo: Todo) => {
    editingTodo.value = todo
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    editingTodo.value = null
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
  const saveTodo = async (todoData: Partial<Todo>) => {
    try {
      // Update if modal is an editing
      if (editingTodo.value) {
        await axios.put(
          `${API_URL}/${editingTodo.value.id}?userRole=${userRole.value}`,
          { ...editingTodo.value, ...todoData }
        )
      } else { // Create new
        await axios.post(`${API_URL}?userRole=${userRole.value}`, {
          ...todoData,
          completed: false
        })
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