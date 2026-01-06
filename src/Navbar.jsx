function Navbar({ onAdd, activeFilter, onFilterChange }) {
  const filters = ["All", "Applied", "Interview", "Rejected"];

  return (
    <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">JobTrackr</h1>
        <div className="mt-2 flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-3 py-1 rounded-full text-sm ${
                activeFilter === f
                  ? "bg-white text-indigo-600"
                  : "bg-indigo-500"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onAdd}
        className="bg-white text-indigo-600 px-4 py-2 rounded"
      >
        + Add Job
      </button>
    </div>
  );
}

export default Navbar;
