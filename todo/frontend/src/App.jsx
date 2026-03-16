import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiPencil, HiTrash, HiPlus } from "react-icons/hi"; // import icons

const App = () => {
  const [todo, setTodo] = useState({ name: "", isCompleted: false });
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const handleChange = (e) =>
    setTodo({ ...todo, [e.target.name]: e.target.value });

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/todo/");
      setTodos(res.data.todos || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch todos");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!todo.name.trim()) return;

    try {
      if (editingId) {
        const res = await axios.put(
          `http://localhost:8080/api/todo/${editingId}`,
          { name: todo.name, isCompleted: todo.isCompleted },
        );
        setTodos((prev) =>
          prev.map((t) => (t._id === editingId ? res.data.todo : t)),
        );
        setEditingId(null);
      } else {
        const res = await axios.post("http://localhost:8080/api/todo/", todo);
        setTodos((prev) => [...prev, res.data.todo]);
      }
      setTodo({ name: "", isCompleted: false });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/todo/${id}`);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete todo");
    }
  };

  const toggleComplete = async (t) => {
    try {
      const res = await axios.put(`http://localhost:8080/api/todo/${t._id}`, {
        isCompleted: !t.isCompleted,
      });
      setTodos((prev) =>
        prev.map((todo) => (todo._id === t._id ? res.data.todo : todo)),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update todo");
    }
  };

  const startEdit = (t) => {
    setEditingId(t._id);
    setTodo({ name: t.name, isCompleted: t.isCompleted });
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "completed") return t.isCompleted;
    if (filter === "pending") return !t.isCompleted;
    return true;
  });

  return (
    <div className="bg-gray-50 w-full min-h-screen">
      <div className="flex flex-col items-center pt-32 p-5">
        <div className="flex flex-col items-center gap-4 w-full max-w-2xl bg-white p-5">
          <h1 className="text-xl font-bold">Todo Tasks</h1>

          {/* Form */}
          <form className="w-full flex gap-2" onSubmit={onSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Enter task"
              value={todo.name}
              onChange={handleChange}
              className="border p-2 flex-1 rounded"
            />
            <button
              type="submit"
              className="bg-teal-600 text-white p-2 rounded flex items-center gap-1"
            >
              {editingId ? "Update Task" : "Add Task"} <HiPlus />
            </button>
          </form>

          {/* Filter buttons */}
          <div className="flex gap-2 mt-2">
            <button
              className={`p-2 rounded border w-24 ${filter === "all" ? "bg-gray-300" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`p-2 rounded border w-24 ${filter === "completed" ? "bg-gray-300" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
            <button
              className={`p-2 rounded border w-24 ${filter === "pending" ? "bg-gray-300" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
          </div>

          {/* Todo table */}
          <div className="w-full flex gap-2 mt-5">
            <table className="border border-collapse w-full">
              <thead>
                <tr>
                  <th className="border p-2">Task</th>
                  <th className="border p-2">Completed</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTodos.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center p-2">
                      No tasks found
                    </td>
                  </tr>
                )}
                {filteredTodos.map((t) => (
                  <tr key={t._id}>
                    <td
                      className={`border p-2 text-center ${t.isCompleted ? "line-through text-gray-400" : ""}`}
                    >
                      {t.name}
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={t.isCompleted}
                        onChange={() => toggleComplete(t)}
                      />
                    </td>
                    <td className="border p-2 text-center flex justify-center gap-2">
                      <button
                        className="p-1 rounded border text-yellow-500 flex items-center gap-1"
                        onClick={() => startEdit(t)}
                      >
                        <HiPencil />
                      </button>
                      <button
                        className="p-1 rounded border text-red-500 flex items-center gap-1"
                        onClick={() => deleteTodo(t._id)}
                      >
                        <HiTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
