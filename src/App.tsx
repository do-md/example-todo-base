import { useState, KeyboardEvent } from "react";
import { StoreProvider, useStore, useStoreApi, type Filter } from "./store";

function AddTodo() {
  const [text, setText] = useState("");
  const store = useStoreApi();

  function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) return;
    store.addTodo(trimmed);
    setText("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleAdd();
  }

  return (
    <div className="add-row">
      <input
        className="add-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
        autoFocus
      />
      <button className="add-btn" onClick={handleAdd}>
        Add
      </button>
    </div>
  );
}

function FilterBar() {
  const filter = useStore((s) => s.state.filter);
  const activeCount = useStore((s) => s.activeCount);
  const store = useStoreApi();

  const filters: Filter[] = ["all", "active", "done"];

  return (
    <div className="filter-bar">
      <span className="item-count">{activeCount} left</span>
      <div className="filter-tabs">
        {filters.map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => store.setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

function TodoList() {
  const todos = useStore((s) => s.filteredTodos);
  const store = useStoreApi();

  if (todos.length === 0) {
    return <p className="empty">Nothing here yet.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className={`todo-item ${todo.done ? "done" : ""}`}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => store.toggleTodo(todo.id)}
          />
          <span className="todo-text">{todo.text}</span>
          <button
            className="delete-btn"
            onClick={() => store.deleteTodo(todo.id)}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}

function TodoApp() {
  return (
    <div className="app">
      <h1 className="title">Todo</h1>
      <AddTodo />
      <FilterBar />
      <TodoList />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <TodoApp />
    </StoreProvider>
  );
}
