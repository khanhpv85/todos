export interface Todo {
    id: string
    title: string
    completed: boolean
    notes?: string
    createdAt: Date // Optional for paid users
    expanded?: boolean
  }