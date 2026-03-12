import { ZenithStore, createReactStore, memo } from "@do-md/zenith";

type Todo = { id: number; text: string; done: boolean };
export type Filter = "all" | "active" | "done";

type State = {
    todos: Todo[];
    filter: Filter;
};

class TodoStore extends ZenithStore<State> {
    constructor() {
        super({
            todos: [
                { id: 1, text: "Read the Zenith docs", done: true },
                { id: 2, text: "Build something with Zenith", done: false },
            ],
            filter: "all",
        });
    }

    @memo((self) => [self.state.todos, self.state.filter])
    get filteredTodos(): Todo[] {
        const { todos, filter } = this.state;
        if (filter === "all") return todos;
        return todos.filter((t) => t.done === (filter === "done"));
    }

    @memo((self) => [self.state.todos])
    get activeCount(): number {
        return this.state.todos.filter((t) => !t.done).length;
    }

    addTodo(text: string) {
        this.produce((d) => {
            d.todos.push({ id: Date.now(), text, done: false });
        });
    }

    toggleTodo(id: number) {
        this.produce((d) => {
            const t = d.todos.find((t) => t.id === id);
            if (t) t.done = !t.done;
        });
    }

    deleteTodo(id: number) {
        this.produce((d) => {
            d.todos = d.todos.filter((t) => t.id !== id);
        });
    }

    setFilter(filter: Filter) {
        this.produce((d) => {
            d.filter = filter;
        });
    }
}

export const { StoreProvider, useStore, useStoreApi } =
    createReactStore(TodoStore);
