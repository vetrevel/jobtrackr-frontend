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

  const API_URL = import.meta.env.VITE_API_URL;

  // 🔹 Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/jobs`);
        const data = await res.json();

        // Clean invalid jobs
        const cleanJobs = data.filter(
          (job) => job.title && job.company && job.status
        );

        setJobs(cleanJobs);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [API_URL]);

  // 🔹 Filter logic
  const filteredJobs =
    filter === "All"
      ? jobs
      : jobs.filter((job) => job.status === filter);

  // 🔹 Stats
  const totalCount = jobs.length;
  const appliedCount = jobs.filter((j) => j.status === "Applied").length;
  const interviewCount = jobs.filter((j) => j.status === "Interview").length;
  const rejectedCount = jobs.filter((j) => j.status === "Rejected").length;

  // 🔹 Delete job
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/api/jobs/${id}`, {
        method: "DELETE",
      });
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // 🔹 Edit job
  const handleEdit = (job) => {
    setEditJob(job);
    setShowModal(true);
  };

  return (
    <>
      <Navbar onAdd={() => setShowModal(true)} />

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 px-6 mt-4">
        {["All", "Applied", "Interview", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1 rounded-full text-sm ${
              filter === status
                ? "bg-indigo-600 text-white"
                : "bg-indigo-200 text-indigo-800"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 mt-6">
        <StatCard title="Total" value={totalCount} />
        <StatCard title="Applied" value={appliedCount} />
        <StatCard title="Interview" value={interviewCount} />
        <StatCard title="Rejected" value={rejectedCount} />
      </div>

      {/* JOB LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 mt-6">
        {loading ? (
          <p className="text-gray-500">Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">
            No jobs found for this status
          </p>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <AddJobModal
          setShowModal={setShowModal}
          jobs={jobs}
          setJobs={setJobs}
          editJob={editJob}
          setEditJob={setEditJob}
        />
      )}
    </>
  );
}

// 🔹 Small stat card component
function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

export default App;
