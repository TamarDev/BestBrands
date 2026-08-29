import uploadToCloudinary from "../Utils/UploadToCloudinary.js";
import Product from "../Models/Products.js";
import Brands from "../Models/Brands.js";

const normalizeSizeValue = (size) => {
  if (typeof size !== "string") {
    return "ONESIZE";
  }

  const compact = size.trim().toUpperCase().replace(/\s+/g, "");
  return compact || "ONESIZE";
};

const normalizeSizes = (sizes) => {
  if (!Array.isArray(sizes)) {
    throw new Error("sizes must be an array");
  }

  return sizes.map(({ size, stock }) => {
    if (typeof size !== "string" || !size.trim()) {
      throw new Error("Each size entry must include a valid size string");
    }

    const parsedStock = Number(stock);

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      throw new Error("Each size entry must include a non-negative integer stock");
    }

    return {
      size: normalizeSizeValue(size),
      stock: parsedStock,
    };
  });
};

const normalizeProductPayload = ({
  name,
  image,
  description,
  price,
  brand,
  category,
  color,
  sizes,
}) => {
  const normalizedSizes = normalizeSizes(sizes);

  return {
    name,
    image,
    description,
    price,
    brand,
    category,
    color,
    sizes: normalizedSizes,
  };
};

export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("brand")
      .populate("category");

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getProductsByBrand = async (req, res) => {
  try {
    const { name } = req.params;

    const brand = await Brands.findOne({ name });

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    const products = await Product.find({ brand: brand._id })
      .populate("brand")
      .populate("category");

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("brand")
      .populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// export const addProduct = async (req, res) => {
//   try {
//     const product = new Product(normalizeProductPayload(req.body));

//     await product.save();

//     return res.status(201).json({
//       message: "Product added successfully",
//       product,
//     });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };


export const addProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      sizes: JSON.parse(req.body.sizes),
    };

    const normalizedProduct =
      normalizeProductPayload(productData);

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer
      );

      normalizedProduct.image = result.secure_url;
    }

    const product = new Product(normalizedProduct);

    await product.save();

    return res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

export const UpdateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      normalizeProductPayload(req.body),
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(updatedProduct);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndDelete(id);

    return res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};