import { useEffect, useState } from "react";

function AddJobModal({
  setShowModal,
  jobs,
  setJobs,
  editJob,
  setEditJob,
}) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Applied");

  // 🔹 Autofill when editing
  useEffect(() => {
    if (editJob) {
      setTitle(editJob.title);
      setCompany(editJob.company);
      setDate(editJob.date?.split("T")[0]);
      setStatus(editJob.status);
    }
  }, [editJob]);

  // 🔹 Submit handler (ADD or UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobData = { title, company, date, status };

    try {
      if (editJob) {
        // ✅ UPDATE
        const res = await fetch(
          `${API_URL}/api/jobs/${editJob._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jobData),
          }
        );

        const updatedJob = await res.json();

        setJobs(
          jobs.map((job) =>
            job._id === updatedJob._id ? updatedJob : job
          )
        );
      } else {
        // ✅ ADD
        const res = await fetch(`${API_URL}/api/jobs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobData),
        });

        const newJob = await res.json();
        setJobs([...jobs, newJob]);
      }

      // Reset & close
      setEditJob(null);
      setShowModal(false);
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-96"
      >
        <h2 className="text-xl font-bold mb-4">
          {editJob ? "Edit Job" : "Add Job"}
        </h2>

        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option>Applied</option>
          <option>Interview</option>
          <option>Rejected</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setEditJob(null);
              setShowModal(false);
            }}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            {editJob ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddJobModal;
