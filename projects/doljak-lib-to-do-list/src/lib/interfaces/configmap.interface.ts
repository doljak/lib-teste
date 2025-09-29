export interface ConfigMap {
    todoList: TodoListConfig;
}

export interface TodoListConfig {
    showFilters: boolean;
    canAddTasks: boolean;
    canEditTasks: boolean,
    canRemoveTasks: boolean
}

