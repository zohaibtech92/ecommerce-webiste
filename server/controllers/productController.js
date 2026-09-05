import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const resolveCategory = async (value) => {
  if (mongoose.isValidObjectId(value)) {
    const category = await Category.findById(value);
    if (category) return category;
  }

  const name = String(value || '').trim();
  if (!name) throw new Error('Category is required');
  return Category.findOneAndUpdate(
    { slug: slugify(name) },
    { name, slug: slugify(name) },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

export const getProducts = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.isFeatured !== undefined) {
    filter.isFeatured = req.query.isFeatured === 'true';
  }

  if (req.query.keyword) {
    filter.$text = { $search: req.query.keyword };
  }

  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 50)
    : 20;

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    data: {
      products,
      totalProducts: products.length,
      page: 1,
      pages: 1
    }
  });
});

export const getProductByIdOrSlug = asyncHandler(async (req, res) => {
  const identifier = req.params.idOrSlug;
  const query = mongoose.isValidObjectId(identifier)
    ? { _id: identifier }
    : { slug: identifier };
  const product = await Product.findOne(query).populate('category', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const category = await resolveCategory(req.body.category);
  const imageUrl = req.body.image || req.body.images?.[0]?.url;
  if (!imageUrl) {
    res.status(400);
    throw new Error('Product image is required');
  }

  const product = await Product.create({
    ...req.body,
    user: req.user._id,
    slug: slugify(req.body.name),
    category: category._id,
    images: [{ public_id: `admin-${Date.now()}`, url: imageUrl }],
    price: Number(req.body.price),
    countInStock: Number(req.body.countInStock),
  });

  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (req.body.category) product.category = (await resolveCategory(req.body.category))._id;
  if (req.body.name) {
    product.name = req.body.name;
    product.slug = slugify(req.body.name);
  }
  ['brand', 'description', 'isFeatured'].forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });
  if (req.body.price !== undefined) product.price = Number(req.body.price);
  if (req.body.countInStock !== undefined) product.countInStock = Number(req.body.countInStock);
  if (req.body.image) product.images = [{ public_id: `admin-${Date.now()}`, url: req.body.image }];

  const updatedProduct = await product.save();
  res.json({ success: true, data: updatedProduct });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product removed' });
});
