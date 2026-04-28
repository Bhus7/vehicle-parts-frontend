import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Appointment from "../components/Appointment";

// Types
type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
};

type FormType = {
  name: string;
  phone: string;
};

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(() => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [form, setForm] = useState<FormType>({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const handleLogout = (): void => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (): void => {
    if (!user) return;

    const updatedUser: User = { ...user, ...form };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">No user data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-blue-600">My Profile</h2>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/customer-dashboard")}
            className="text-blue-600 hover:underline"
          >
            Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Profile + Vehicle */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Profile Info */}
        <div className="bg-white p-6 rounded-lg shadow">

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">

            <div>
              <label className="text-gray-500 text-sm">Name</label>
              {isEditing ? (
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              ) : (
                <p className="text-gray-800 font-medium">{user.name}</p>
              )}
            </div>

            <div>
              <label className="text-gray-500 text-sm">Email</label>
              <p className="text-gray-800 font-medium">{user.email}</p>
            </div>

            <div>
              <label className="text-gray-500 text-sm">Phone</label>
              {isEditing ? (
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              ) : (
                <p className="text-gray-800 font-medium">{user.phone}</p>
              )}
            </div>

            <div>
              <label className="text-gray-500 text-sm">Role</label>
              <p className="text-gray-800 font-medium">{user.role}</p>
            </div>

          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          )}
        </div>

        {/* Vehicle Section */}
        <div className="bg-white p-6 rounded-lg shadow">

          <h3 className="text-lg font-semibold mb-4">My Vehicles</h3>

          <p className="text-gray-600 mb-4">
            You have not added any vehicles yet.
          </p>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Vehicle
          </button>

        </div>

      </div>

      {/* Appointment Section */}
      <Appointment />

    </div>
  );
};

export default Profile;
