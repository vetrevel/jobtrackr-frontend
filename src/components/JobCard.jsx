function JobCard({ job, onEdit, onDelete }) {
  if (!job) return null;

  const statusColors = {
    Applied: "bg-blue-100 text-blue-700",
    Interview: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <div
      className="
        bg-white p-5 rounded-lg shadow
        flex flex-col justify-between
        transition-all duration-300 ease-in-out
        hover:shadow-xl hover:-translate-y-1
      "
    >
      {/* Job Info */}
      <div>
        <h3 className="text-lg font-bold text-gray-800">
          {job.title}
        </h3>

        <p className="text-gray-600">
          {job.company}
        </p>

        <p className="text-sm text-gray-400 mt-1">
          {job.date?.split("T")[0]}
        </p>

        {/* Status Badge */}
        <span
          className={`
            inline-block mt-3 px-3 py-1 text-sm rounded-full
            transition-colors duration-300
            ${statusColors[job.status]}
          `}
        >
          {job.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => onEdit(job)}
          className="
            text-blue-600 hover:underline
            transition-colors duration-200
            hover:text-blue-800
          "
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(job._id)}
          className="
            text-red-600 hover:underline
            transition-colors duration-200
            hover:text-red-800
          "
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default JobCard;
