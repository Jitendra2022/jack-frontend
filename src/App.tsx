import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);
  const baseURL = import.meta.env.VITE_BASE_URL;

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${baseURL}api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ➕ Add or Update user
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `${baseURL}api/users/${editId}`
        : `${baseURL}api/users`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: "", email: "" });
        setEditId(null);
        fetchUsers(); // Refresh table
      }
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  // 🗑️ Delete user
  const handleDelete = async (id:any) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${baseURL}api/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // ✏️ Start editing
  const handleEdit = (user:any) => {
    setFormData({ name: user.name, email: user.email });
    setEditId(user._id);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">User Management</h2>

      {/* User Form */}
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row g-2">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-4 d-flex">
            <button type="submit" className="btn btn-primary me-2 w-100">
              {editId ? "Update User" : "Add User"}
            </button>
            {editId && (
              <button
                type="button"
                className="btn btn-secondary w-100"
                onClick={() => {
                  setFormData({ name: "", email: "" });
                  setEditId(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* User Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th >#</th>
            <th>Name</th>
            <th>Email</th>
            <th >Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user:any, index) => (
              <tr key={user.id || index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td  className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
