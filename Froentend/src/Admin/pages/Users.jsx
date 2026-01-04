import { useEffect, useState } from "react";
import instance from "../../axios.Config";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await instance.get("api/auth/user");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p className="p-6">Loading users...</p>;
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>

        <div className="bg-blue-600 text-white px-4 py-2 rounded">
          Total Users: {users.length}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">#</th>
              <th className="border p-3">Name</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td className="border p-3">{index + 1}</td>
                <td className="border p-3">{user.name}</td>
                <td className="border p-3">{user.email}</td>
                <td className="border p-3">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
