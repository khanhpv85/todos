<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg w-full max-w-md">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ todo ? 'Edit Todo' : 'Add New Todo' }}
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
          @click="$emit('close')"
          class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button 
          @click="saveTodo"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          :disabled="!todoTitle.trim()"
        >
          {{ todo ? 'Save' : 'Add' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { Todo } from '@/types/todo'

  // Define component's Props in Vue 3
  const props = defineProps<{
    todo: Todo | null
    userRole: 'free' | 'paid'
  }>()

  // Define component's Emits in Vue 3
  // This defines the events that the component can emit
  const emit = defineEmits<{
    (e: 'save', todoData: Partial<Todo>): void
    (e: 'close'): void
  }>()

  const todoTitle = ref(props.todo?.title || '')
  const todoNotes = ref(props.todo?.notes || '')
  const saveTodo = () => {
    if (!todoTitle.value.trim()) return
  
    emit('save', {
      title: todoTitle.value,
      ...(props.userRole === 'paid' && { notes: todoNotes.value })
    })
  }
</script>