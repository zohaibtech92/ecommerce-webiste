import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart.js';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col justify-between">
      <Link to={`/products/${product.slug || product._id}`}>
        <div className="h-48 bg-gray-50 flex justify-center items-center p-4">
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="max-h-full object-contain"
          />
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            {product.brand}
          </span>
          <Link to={`/products/${product.slug || product._id}`}>
            <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition line-clamp-2 mt-1">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">${product.price?.toFixed(2)}</span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="cursor-pointer text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-md transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;