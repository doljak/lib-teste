export interface TodoList {
    todos: TodoListItem[];
}

export interface TodoListItem{
    compromisse: string;
    done?: boolean;
    id: string;
    dates?: DateConstructor;
    isDeleted?: boolean;
    user_id?: number;
    description?: string;
}
interface DateConstructor {
    created_at: Date;
    updated_at?: Date;
    finished_at?: Date | null;
}