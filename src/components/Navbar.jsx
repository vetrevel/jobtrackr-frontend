function Navbar({ onAdd, filter, setFilter }) {
  const filters = ["All", "Applied", "Interview", "Rejected"];

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">JobTrackr</h1>

        <button
          onClick={onAdd}
          className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
        >
          + Add Job
        </button>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-3 mt-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === f
                ? "bg-white text-indigo-600"
                : "bg-indigo-500 text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
