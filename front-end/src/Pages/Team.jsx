import { useEffect, useState } from "react";
import api from "../Services/apiConnector";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Team = () => {
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState("");
  const { id } = useParams();

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/team/${id}/members`);
      setMembers(res.data.members);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/team/users/all");
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchUsers();
  }, []);

  const handleAddMember = async () => {
    if (!selectedUser) return toast.error("Select a user");

    try {
      await api.post(`/team/${id}/members`, { userId: selectedUser });
      toast.success("Member added");
      setSelectedUser("");
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await api.delete(`/team/${id}/members/${memberId}`);
      toast.success("Member removed");
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove member");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Team Members</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {members.map((m) => (
            <li
              key={m._id}
              className="flex justify-between items-center bg-white p-3 rounded shadow"
            >
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-gray-500 text-sm">{m.email}</p>
              </div>
              <button
                onClick={() => handleRemoveMember(m._id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Add Member</h2>
        <div className="flex space-x-2 items-center">
          <select
            className="border p-2 rounded flex-1"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <button
            onClick={handleAddMember}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Team;
