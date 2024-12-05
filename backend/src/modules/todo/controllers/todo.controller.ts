import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { TodoService } from '../services/todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(@Query('userRole') userRole: string) {
    return this.todoService.findAll(userRole);
  }

  @Post()
  create(@Body() todoData: any, @Query('userRole') userRole: string) {
    return this.todoService.create(todoData, userRole);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() todoData: any,
    @Query('userRole') userRole: string,
  ) {
    return this.todoService.update(id, todoData, userRole);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Query('userRole') userRole: string) {
    return this.todoService.delete(id, userRole);
  }
}
