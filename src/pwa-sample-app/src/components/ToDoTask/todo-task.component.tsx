import React from 'react';
import TodoTaskModel from './todo-task.model';

export const ToDoTask = (props: TodoTaskModel) =>
    <li className={`todo-task status`}>{props.text}</li>