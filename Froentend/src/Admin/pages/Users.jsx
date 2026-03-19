import { useEffect, useState } from "react";
import instance, { withAuthRole } from "../../axios.Config";

function getErrorMessage(error, fallbackMessage) {
  return error.response?.data?.message || fallbackMessage;
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowAction, setRowAction] = useState({});
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await instance.get("/admin/users", withAuthRole("admin"));
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to load users", err);
      setFeedback({
        type: "error",
        message: getErrorMessage(err, "Failed to load users"),
      });
    } finally {
      setLoading(false);
    }
  }

  function startRowAction(userId, action) {
    setRowAction((prev) => ({
      ...prev,
      [userId]: action,
    }));
  }

  function stopRowAction(userId) {
    setRowAction((prev) => {
      const next = { ...prev };
      delete next[userId];
      return next;
    });
  }

  async function toggleBlock(userId) {
    const previousUsers = users;
    const selectedUser = users.find((user) => user._id === userId);

    if (!selectedUser) {
      return;
    }

    startRowAction(userId, "block");
    setFeedback({ type: "", message: "" });
    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId
          ? { ...user, isBlocked: !user.isBlocked }
          : user
      )
    );

    try {
      const res = await instance.patch(
        `/admin/users/${userId}/block`,
        {},
        withAuthRole("admin")
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, ...res.data.user }
            : user
        )
      );

      setFeedback({
        type: "success",
        message: res.data.message || "User status updated successfully",
      });
    } catch (err) {
      console.error("Block/Unblock failed", err);
      setUsers(previousUsers);
      setFeedback({
        type: "error",
        message: getErrorMessage(err, "Block/Unblock failed"),
      });
    } finally {
      stopRowAction(userId);
    }
  }

  async function handleDelete(userId) {
    const previousUsers = users;
    const selectedUser = users.find((user) => user._id === userId);

    if (!selectedUser) {
      return;
    }

    const isConfirmed = window.confirm(
      `Delete ${selectedUser.name || selectedUser.email}? This action cannot be undone.`
    );

    if (!isConfirmed) {
      return;
    }

    startRowAction(userId, "delete");
    setFeedback({ type: "", message: "" });
    setUsers((prev) => prev.filter((user) => user._id !== userId));

    try {
      const res = await instance.delete(
        `/admin/users/${userId}`,
        withAuthRole("admin")
      );

      setFeedback({
        type: "success",
        message: res.data.message || "User deleted successfully",
      });
    } catch (err) {
      console.error("Delete user failed", err);
      setUsers(previousUsers);
      setFeedback({
        type: "error",
        message: getErrorMessage(err, "Delete user failed"),
      });
    } finally {
      stopRowAction(userId);
    }
  }

  if (loading) {
    return <p className="p-6">Loading users...</p>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-gray-500">
            Manage user access, blocking, and deletion from one place.
          </p>
        </div>

        <div className="rounded bg-blue-600 px-4 py-2 text-white">
          Total Users: {users.length}
        </div>
      </div>

      {feedback.message && (
        <div
          className={`mb-4 rounded border px-4 py-3 text-sm ${
            feedback.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full min-w-[720px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">#</th>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Role</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan="6">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, index) => {
                const activeAction = rowAction[user._id];
                const isRowBusy = Boolean(activeAction);

                return (
                  <tr key={user._id} className="border-t">
                    <td className="border p-3">{index + 1}</td>
                    <td className="border p-3">{user.name || "N/A"}</td>
                    <td className="border p-3">{user.email}</td>
                    <td className="border p-3 capitalize">{user.role}</td>

                    <td className="border p-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          user.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="border p-3">
                      {user.role === "admin" ? (
                        <span className="text-sm text-gray-500">Protected</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => toggleBlock(user._id)}
                            disabled={isRowBusy}
                            className={`rounded px-3 py-1 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                              user.isBlocked
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-amber-500 hover:bg-amber-600"
                            }`}
                          >
                            {activeAction === "block"
                              ? "Saving..."
                              : user.isBlocked
                              ? "Unblock"
                              : "Block"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(user._id)}
                            disabled={isRowBusy}
                            className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {activeAction === "delete" ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
