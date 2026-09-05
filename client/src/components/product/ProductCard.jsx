import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/300';

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      <Link to={`/products/${product.slug || product._id}`} className="block overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          {product.brand}
        </span>
        <Link
          to={`/products/${product.slug || product._id}`}
          className="text-base font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors mb-2"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-lg font-extrabold text-slate-900">${product.price?.toFixed(2)}</span>
          <span
            className={`text-xs px-2 py-1 rounded font-medium ${
              product.countInStock > 0
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;