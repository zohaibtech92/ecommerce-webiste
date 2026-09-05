
const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 rounded border border-slate-300 text-sm font-medium text-slate-700 disabled:opacity-50 hover:bg-slate-100"
      >
        Previous
      </button>
      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-1 rounded border text-sm font-medium ${
            page === num
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
        >
          {num}
        </button>
      ))}
      <button
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 rounded border border-slate-300 text-sm font-medium text-slate-700 disabled:opacity-50 hover:bg-slate-100"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;