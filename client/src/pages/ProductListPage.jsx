import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../services/productService';
import { fetchCategories } from '../services/categoryService';
import ProductGrid from '../components/product/ProductGrid';
import CategoryMenu from '../components/product/CategoryMenu';
import Pagination from '../components/product/Pagination';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await fetchProducts({ keyword, category, sort, page, limit: 12 });
        setProducts(res.data.products);
        setPagination({ page: res.data.page, pages: res.data.pages });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [keyword, category, sort, page]);

  const handleCategoryChange = (catId) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (catId) newParams.set('category', catId);
      else newParams.delete('category');
      newParams.set('page', '1');
      return newParams;
    });
  };

  const handleSortChange = (e) => {
    const sortVal = e.target.value;
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (sortVal) newParams.set('sort', sortVal);
      else newParams.delete('sort');
      return newParams;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', newPage.toString());
      return newParams;
    });
  };

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Catalog</h1>
          {keyword && <p className="text-sm text-slate-500">Search results for "{keyword}"</p>}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Sort by:</label>
          <select
            value={sort}
            onChange={handleSortChange}
            className="border border-slate-300 text-sm rounded-lg p-2 bg-white"
          >
            <option value="">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="md:col-span-1">
          <CategoryMenu
            categories={categories}
            selectedCategory={category}
            onSelectCategory={handleCategoryChange}
          />
        </div>

        {/* Main Product Display */}
        <div className="md:col-span-3">
          {loading ? (
            <Loader label="Loading catalog..." />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <>
              <ProductGrid products={products} />
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;