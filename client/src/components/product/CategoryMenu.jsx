
const CategoryMenu = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">
        Categories
      </h3>
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onSelectCategory('')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              selectedCategory === ''
                ? 'bg-blue-50 text-blue-600 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>
        </li>
        {categories.map((cat) => (
          <li key={cat._id}>
            <button
              onClick={() => onSelectCategory(cat._id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedCategory === cat._id
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryMenu;