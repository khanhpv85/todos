import { Injectable } from '@nestjs/common';
import { Todo } from '../entities/todo.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];

  findAll(userId: string): Todo[] {
    return this.todos.filter((todo) => todo.userId === userId);
  }

  create(todoData: Partial<Todo>, userId: string): Todo {
    const todo: Todo = {
      id: uuidv4(),
      title: todoData.title,
      completed: false,
      createdAt: new Date(),
      notes: todoData.notes,
      userId,
    };
    this.todos.push(todo);
    return todo;
  }

  update(id: string, todoData: Partial<Todo>, userId: string): Todo {
    const index = this.todos.findIndex(
      (t) => t.id === id && t.userId === userId,
    );
    if (index > -1) {
      this.todos[index] = { ...this.todos[index], ...todoData };
      return this.todos[index];
    }
    return null;
  }

  delete(id: string, userId: string): boolean {
    const index = this.todos.findIndex(
      (t) => t.id === id && t.userId === userId,
    );
    if (index > -1) {
      this.todos.splice(index, 1);
      return true;
    }
    return false;
  }
}
