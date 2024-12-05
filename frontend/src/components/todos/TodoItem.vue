<template>
  <div class="p-4">
    <!-- Todo Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input 
          type="checkbox" 
          :checked="todo.completed"
          @change="$emit('toggle', todo)"
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
          @click="$emit('edit', todo)"
          class="text-blue-500 hover:text-blue-700"
        >
          Edit
        </button>
        <button 
          @click="$emit('delete', todo)"
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
          v-model="localNotes"
          rows="2"
          class="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
          placeholder="Add notes..."
          @blur="updateNotes"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import type { Todo } from '@/types/todo'

  // Define component's Props in Vue 3
  const props = defineProps<{
    todo: Todo
    userRole: 'free' | 'paid'
  }>()

  // Define component's Emits in Vue 3
  // This defines the events that the component can emit
  const emit = defineEmits<{
    (e: 'toggle', todo: Todo): void
    (e: 'edit', todo: Todo): void
    (e: 'delete', todo: Todo): void
    (e: 'update-notes', todo: Todo): void
  }>()

  const localNotes = ref(props.todo.notes || '')
  watch(() => props.todo.notes, (newNotes) => {
    localNotes.value = newNotes || ''
  })
  const updateNotes = () => {
    emit('update-notes', { ...props.todo, notes: localNotes.value })
  }
</script>
