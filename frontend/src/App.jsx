import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// Created solely by Sanskar Khandelwal
const API = "http://localhost:8080/students";

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: ""
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(API);
      setStudents(res.data);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const saveStudent = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.course) {
      setError("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      if (editId) {
        await axios.put(API + "/" + editId, form);
      } else {
        await axios.post(API, form);
      }
      setForm({ name: "", email: "", course: "" });
      setEditId(null);
      loadStudents();
    } catch (err) {
      setError("Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) {
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await axios.delete(API + "/" + id);
      loadStudents();
    } catch (err) {
      setError("Failed to delete student");
    } finally {
      setLoading(false);
    }
  };

  const editStudent = (student) => {
    setForm(student);
    setEditId(student.id);
  };

  return (
    <div className="app-root">
      <div className="app-shell">
        <h1>Student Management</h1>

        <div className="form-section">
          <h2>{editId ? "Edit Student" : "Add Student"}</h2>

        {error && (
          <div style={{ color: "red", marginBottom: "10px", padding: "10px", border: "1px solid red" }}>
            {error}
            <button
              onClick={() => setError(null)}
              style={{ float: "right", border: "none", background: "none", cursor: "pointer" }}
            >
              X
            </button>
          </div>
        )}

        <form onSubmit={saveStudent}>
          <div style={{ marginBottom: "10px" }}>
            <label>Name: </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              disabled={loading}
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Email: </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              disabled={loading}
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Course: </label>
            <input
              type="text"
              value={form.course}
              onChange={e => setForm({ ...form, course: e.target.value })}
              required
              disabled={loading}
              className="input-field"
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <button
              type="submit"
              disabled={loading}
              className="button-primary"
              style={{ marginRight: "10px" }}
            >
              {loading ? "Saving..." : (editId ? "Update" : "Add")}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setForm({ name: "", email: "", course: "" });
                  setEditId(null);
                  setError(null);
                }}
                disabled={loading}
                className="button-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2>Students ({students.length})</h2>

        {loading && students.length === 0 && (
          <div>Loading...</div>
        )}

        <div className="grid">
          {students.map(student => (
            <div key={student.id} className="card">
              <h3>{student.name}</h3>
              <p>Email: {student.email}</p>
              <p>Course: {student.course}</p>
              <div className="card-actions">
                <button
                  onClick={() => editStudent(student)}
                  disabled={loading}
                  className="button-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteStudent(student.id)}
                  disabled={loading}
                  className="button-secondary"
                  style={{ background: "#dc2626" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {!loading && students.length === 0 && (
          <div>No students found</div>
        )}
      </div>
      </div>
      <footer className="footer">
        made by sanskar khandelwal 🔥
      </footer>
    </div>
  );
}