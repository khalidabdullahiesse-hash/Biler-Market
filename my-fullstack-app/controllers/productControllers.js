import Product from "../db/models/products.js";

/**
 * @desc Create product
 * @route POST /products
 * @access Private
 */
export const createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      owner: req.user._id,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


/**
 * @desc Get all products (user only)
 * @route GET /products
 * @access Private
 */
export const getProducts = async (req, res) => {
  try {
    await req.user.populate("products");
    res.json(req.user.products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * @desc Get single product
 * @route GET /products/:id
 * @access Private
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * @desc Update product
 * @route PATCH /products/:id
 * @access Private
 */
export const updateProduct = async (req, res) => {
  const allowedUpdates = ["name", "price", "description"]; // adjust fields
  const updates = Object.keys(req.body);

  const isValid = updates.every((f) =>
    allowedUpdates.includes(f)
  );

  if (!isValid) {
    return res.status(400).json({ error: "Invalid updates" });
  }

  try {
    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user._id, // ✅ SECURITY FIX
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    updates.forEach((f) => {
      product[f] = req.body[f];
    });

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


/**
 * @desc Delete product
 * @route DELETE /products/:id
 * @access Private
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id, // ✅ SECURITY FIX
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};