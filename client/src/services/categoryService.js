import api from './api.js';

export const fetchCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const fetchCategoryBySlug = async (slug) => {
  const response = await api.get(`/categories/${slug}`);
  return response.data;
};