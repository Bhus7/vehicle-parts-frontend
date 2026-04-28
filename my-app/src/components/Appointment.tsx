import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

// Types
type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
};

type AppointmentType = {
  id: number;
  vehicleNumber: string;
  appointmentDate: string;
  description: string;
  status: string;
  customerId: number;
};

type FormType = {
  vehicleNumber: string;
  appointmentDate: string;
  description: string;
};

const Appointment = () => {
  const navigate = useNavigate();

  const user: User | null = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [form, setForm] = useState<FormType>({
    vehicleNumber: "",
    appointmentDate: "",
    description: "",
  });

  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch appointments
  useEffect(() => {
    if (!user?.id) return;

    const fetchAppointments = async () => {
      try {
        const res = await API.get<AppointmentType[]>(
          `/appointments/${user.id}`
        );
        setAppointments(res.data);
      } catch (err: unknown) {
        console.log(err);
      }
    };

    fetchAppointments();
  }, [user?.id]);

  // Handle input
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.vehicleNumber || !form.appointmentDate || !form.description) {
      alert("All fields are required");
      return;
    }

    if (!user) return;

    try {
      setLoading(true);

      await API.post("/appointments", {
        vehicleNumber: form.vehicleNumber,
        appointmentDate: new Date(form.appointmentDate).toISOString(),
        description: form.description,
        customerId: user.id,
      });

      alert("Appointment booked successfully");

      setForm({
        vehicleNumber: "",
        appointmentDate: "",
        description: "",
      });

      const res = await API.get<AppointmentType[]>(
        `/appointments/${user.id}`
      );
      setAppointments(res.data);

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data || err.message);
      } else if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log(err);
      }

      alert("Error booking appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white shadow px-6 py-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-blue-600">
          My Appointments
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Book Appointment
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              name="vehicleNumber"
              placeholder="Vehicle Number"
              value={form.vehicleNumber}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />

            <input
              type="date"
              name="appointmentDate"
              value={form.appointmentDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />

            <textarea
              name="description"
              placeholder="Service Description"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>

          </form>
        </div>

        {/* List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            My Appointments
          </h3>

          {appointments.length === 0 ? (
            <p className="text-gray-600">No appointments yet</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((a) => (
                <div key={a.id} className="border p-3 rounded">

                  <p><strong>Vehicle:</strong> {a.vehicleNumber}</p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(a.appointmentDate).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="text-blue-600">
                      {a.status || "Pending"}
                    </span>
                  </p>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Appointment;
