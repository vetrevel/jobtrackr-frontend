function JobCard({ _id, title, company, date, status, onDelete, onEdit }) {
  const statusColor =
    status === "Applied"
      ? "bg-blue-100 text-blue-700"
      : status === "Interview"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-600">{company}</p>
        <p className="text-sm text-gray-500">{date}</p>

        <span
          className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${statusColor}`}
        >
          {status}
        </span>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => onEdit({ _id, title, company, date, status })}
          className="text-blue-600 text-sm hover:underline"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(_id)}
          className="text-red-600 text-sm hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default JobCard;
