import React, { Component } from 'react';
import { Message } from 'components/Message/message.component';
import TodoTaskModel from './todo-task.model';
import { ToDoTask } from './todo-task.component';
import { Icon } from 'components/Icons/icons.component';

type TodoListState = {
    isSupported: boolean,
    tasks: TodoTaskModel[],
    inputTask: string
};

export default class TodoListComponent extends Component<{}, TodoListState> {

    constructor(props: any) {
        super(props);

        const isLocalStorageSupported = !!window.localStorage;

        const savedTasksString = isLocalStorageSupported ? localStorage.getItem('todo-tasks') ?? '[]' : '[]';

        this.state = {
            isSupported: isLocalStorageSupported,
            tasks: JSON.parse(savedTasksString),
            inputTask: ''
        }
    }

    onChange(evt: React.FormEvent<HTMLInputElement>) {
        this.setState({
            inputTask: evt.currentTarget.value
        });
    }

    onAddTask() {
        const tasks = this.state.tasks;
        tasks.push({ text: this.state.inputTask, status: 'todo'});

        localStorage.setItem('todo-tasks', JSON.stringify(tasks));
        this.setState({
            tasks: tasks,
            inputTask: ''
        });
    }

    onClearList() {
        localStorage.setItem('todo-tasks', '[]');
        this.setState({
            tasks: []
        });
    }

    renderTasks() {
        if (this.state.tasks.length === 0) {
            return null;
        }

        const tasks = this.state.tasks.map((task, index) => <ToDoTask key={index} text={task.text} status={task.status} />);
        return (
            <ul>
                {tasks}
            </ul>);
    }

    render() {
        if (!this.state.isSupported) {
            return (<Message message='Your browser do not support local storage.' />)
        }

        return (
            <div className="full-view-port">
                {this.renderTasks()}
                <div className="bottom-form">
                    <form onSubmit={this.onAddTask.bind(this)}>
                        <input value={this.state.inputTask} onChange={this.onChange.bind(this)} autoFocus />
                    </form>
                    <button className="btn" onClick={this.onAddTask.bind(this)}><Icon name='add_circle_outline'/></button>
                    <button className="btn" onClick={this.onClearList.bind(this)}><Icon name='clear'/></button>
                </div>
            </div>
        );
    }
}

