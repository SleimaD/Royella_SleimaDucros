import React, { useEffect, useState } from "react";
import { useAuth } from "./../../RolesRoutes/AuthProvider";

const UserAccounts = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/users/", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          const errorData = await response.json();
          setMessage(errorData.detail || "Failed to fetch users");
        }
      } catch (error) {
        setMessage("An error occurred while fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/update_role/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(user => user.id === userId ? updatedUser : user));
        setMessage("User role updated successfully!");
      } else {
        const errorData = await response.json();
        setMessage(errorData.detail || "Failed to update user role");
      }
    } catch (error) {
      setMessage("An error occurred while updating the user role");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 w-full h-screen flex flex-col justify-center items-center gap-7">
      <h1 className="text-2xl mb-4">User Accounts</h1>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <table className="w-[70%] bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
          </tr>
        </thead> 
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b ">
                  <img src={user.photo} className="w-8 h-8 rounded-full" alt="" />
                  {user.username}
              </td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="block w-full mt-1 rounded-md border-gray-300 shadow-sm"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="WEBMASTER">Webmaster</option>
                  <option value="REDACTEUR">Redacteur</option>
                  <option value="RECEPTIONIST">Receptionist</option>
                  <option value="UTILISATEUR">Utilisateur</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserAccounts;
