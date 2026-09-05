import api from './api.js';

export const fetchProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const fetchProductByIdOrSlug = async (idOrSlug) => {
  const response = await api.get(`/products/${idOrSlug}`);
  return response.data;
};