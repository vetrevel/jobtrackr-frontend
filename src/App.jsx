import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import JobCard from "./components/JobCard";
import AddJobModal from "./components/AddJobModal";

function App() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔒 Stable backend URL (no env confusion)
  const API_URL = "http://localhost:5000/api";

  // =========================
  // FETCH JOBS
  // =========================
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/jobs`);

        if (!res.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await res.json();
        console.log("FETCHED JOBS:", data);

        // Safety: allow only valid jobs
        const cleanJobs = Array.isArray(data)
          ? data.filter(
              (job) =>
                job._id &&
                job.title &&
                job.company &&
                job.status
            )
          : [];

        setJobs(cleanJobs);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Unable to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // =========================
  // ADD JOB
  // =========================
  const addJob = async (job) => {
    const res = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });

    const newJob = await res.json();
    setJobs((prev) => [...prev, newJob]);
  };

  // =========================
  // UPDATE JOB
  // =========================
  const updateJob = async (job) => {
    const res = await fetch(`${API_URL}/jobs/${job._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });

    const updatedJob = await res.json();
    setJobs((prev) =>
      prev.map((j) =>
        j._id === updatedJob._id ? updatedJob : j
      )
    );
  };

  // =========================
  // DELETE JOB
  // =========================
  const deleteJob = async (id) => {
    await fetch(`${API_URL}/jobs/${id}`, {
      method: "DELETE",
    });

    setJobs((prev) => prev.filter((job) => job._id !== id));
  };

  // =========================
  // FILTER LOGIC
  // =========================
  const filteredJobs =
    filter === "All"
      ? jobs
      : jobs.filter(
          (job) =>
            job.status?.toLowerCase() ===
            filter.toLowerCase()
        );

  // =========================
  // STATS
  // =========================
  const stats = {
    total: jobs.length,
    applied: jobs.filter(
      (j) => j.status === "Applied"
    ).length,
    interview: jobs.filter(
      (j) => j.status === "Interview"
    ).length,
    rejected: jobs.filter(
      (j) => j.status === "Rejected"
    ).length,
  };

  // =========================
  // UI STATES
  // =========================
  if (loading) {
    return (
      <h2 className="p-6 text-lg">
        Loading jobs...
      </h2>
    );
  }

  if (error) {
    return (
      <h2 className="p-6 text-red-600">
        {error}
      </h2>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <Navbar
        activeFilter={filter}
        onFilterChange={setFilter}
        onAdd={() => {
          setEditJob(null);
          setShowModal(true);
        }}
      />

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 mt-6">
        <StatCard label="Total" value={stats.total} />
        <StatCard
          label="Applied"
          value={stats.applied}
          color="blue"
        />
        <StatCard
          label="Interview"
          value={stats.interview}
          color="yellow"
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          color="red"
        />
      </div>

      {/* MODAL */}
      {showModal && (
        <AddJobModal
          initialData={editJob}
          onClose={() => {
            setShowModal(false);
            setEditJob(null);
          }}
          onSave={editJob ? updateJob : addJob}
        />
      )}

      {/* JOB LIST */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No jobs found
          </p>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              {...job}
              onDelete={deleteJob}
              onEdit={(job) => {
                setEditJob(job);
                setShowModal(true);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

// =========================
// STAT CARD COMPONENT
// =========================
function StatCard({ label, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div
      className={`p-4 rounded shadow text-center ${
        colors[color] || "bg-white"
      }`}
    >
      <p className="text-sm text-gray-500">
        {label}
      </p>
      <p className="text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}

export default App;
