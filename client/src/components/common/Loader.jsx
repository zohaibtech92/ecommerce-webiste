
const Loader = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3 text-sm text-gray-500 font-medium">{label}</p>
    </div>
  );
};

export default Loader;