import mongoose from "mongoose";
import ShoppingCart from '../Models/ShoppingCart.js'
import Product from '../Models/Products.js'

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value)

// Calculate a safe total without mutating the document.
const calculateCartSum = async (cart) => {
  const productIds = cart.items.map(item => item.product);
  const products = await Product.find({ _id: { $in: productIds } });
  
  const priceMap = products.reduce((map, prod) => {
    map[prod._id.toString()] = prod.price;
    return map;
  }, {});

  return cart.items.reduce((total, item) => {
    const price = priceMap[item.product.toString()] || 0;
    return total + (price * item.quantity);
  }, 0);
}

const validateProductId = (productId) => {
  if (!productId || !isValidObjectId(productId)) {
    return { valid: false, message: 'A valid productId is required' }
  }
  return { valid: true }
}

const normalizeCartSize = (size) => String(size || '').trim().toUpperCase().replace(/\s+/g, '')

const getSelectedSizeEntry = (
  product,
  size
) => {
  if (Array.isArray(product.sizes) && product.sizes.length > 0) {
    const singleGenericSize =
      product.sizes.length === 1 &&
      normalizeCartSize(product.sizes[0].size) === 'ONESIZE'

    if (!size) {
      if (singleGenericSize) {
        return {
          valid: true,
          hasSizes: true,
          selectedSize: product.sizes[0],
        }
      }

      return {
        valid: false,
        message: 'Size is required',
      }
    }

    const normalizedSize = normalizeCartSize(size)
    const selectedSize = product.sizes.find(
      (item) => normalizeCartSize(item.size) === normalizedSize
    )

    if (!selectedSize) {
      return {
        valid: false,
        message: 'Selected size does not exist',
      }
    }

    return {
      valid: true,
      hasSizes: true,
      selectedSize,
    }
  }

  return {
    valid: true,
    hasSizes: false,
    selectedSize: null,
  }
}

// ========== ADMIN FUNCTIONS ==========

export const getAllShoppingCart = async (req, res) => {
  try {
    const shoppingCarts = await ShoppingCart.find({})
      .populate('user', 'firstName lastName email')
      .populate('items.product')
    res.status(200).json({ success: true, carts: shoppingCarts })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

export const getShoppingCartById = async (req, res) => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid cart id' })
    }

    const shoppingCart = await ShoppingCart.findById(id)
      .populate('user', 'firstName lastName email')
      .populate('items.product')

    if (!shoppingCart) {
      return res.status(404).json({ success: false, message: 'ShoppingCart not found' })
    }
    res.status(200).json({ success: true, cart: shoppingCart })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

export const deleteShoppingCart = async (req, res) => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid cart id' })
    }

    const shoppingCart = await ShoppingCart.findByIdAndDelete(id)
    if (!shoppingCart) {
      return res.status(404).json({ success: false, message: 'ShoppingCart not found' })
    }
    res.status(200).json({ success: true, message: 'ShoppingCart deleted successfully' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// ========== USER SHOPPING CART FUNCTIONS ==========

export const getMyCart = async (req, res) => {
  try {
    const userId = req.user?.userId; 
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized. User missing.' })
    }

    let shoppingCart = await ShoppingCart.findOne({ user: userId }).populate("items.product");

    if (!shoppingCart) {
      shoppingCart = await ShoppingCart.create({ user: userId, items: [], sum: 0 });
      shoppingCart = await ShoppingCart.findById(shoppingCart._id).populate("items.product");
    }

    return res.status(200).json({ success: true, cart: shoppingCart });
  } catch (err) {
    console.error("Get cart error:", err);
    return res.status(500).json({ success: false, message: "Failed to get shopping cart.", error: err.message });
  }
};

export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user?.userId
    const { productId, quantity = 1, size } = req.body

    const productValidation = validateProductId(productId)
    if (!productValidation.valid) {
      return res.status(400).json({ success: false, message: productValidation.message })
    }

    const parsedQuantity = Number(quantity)
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive integer' })
    }

    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const sizeResult = getSelectedSizeEntry(product, size)
    if (!sizeResult.valid) {
      return res.status(400).json({
        success: false,
        message: sizeResult.message,
      })
    }

    const normalizedSize = sizeResult.hasSizes
      ? normalizeCartSize(sizeResult.selectedSize.size || size || 'ONESIZE')
      : 'ONESIZE'

    if (sizeResult.hasSizes && sizeResult.selectedSize.stock < parsedQuantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock',
      })
    }

    let shoppingCart = await ShoppingCart.findOne({ user: userId })

    if (!shoppingCart) {
      shoppingCart = new ShoppingCart({
        user: userId,
        items: [{ product: productId, quantity: parsedQuantity, size: normalizedSize }],
        sum: 0
      })
    } else {
      const existingItem = shoppingCart.items.find(
        (item) =>
          item.product.toString() === productId &&
          normalizeCartSize(item.size || 'ONESIZE') === normalizedSize
      )

      const nextQuantity = (existingItem?.quantity || 0) + parsedQuantity
      if (sizeResult.hasSizes && sizeResult.selectedSize.stock < nextQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Not enough stock',
        })
      }

      if (existingItem) {
        existingItem.quantity += parsedQuantity
      } else {
        shoppingCart.items.push({ product: productId, quantity: parsedQuantity, size: normalizedSize })
      }
    }

    shoppingCart.sum = await calculateCartSum(shoppingCart)
    await shoppingCart.save()

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      cart: await shoppingCart.populate('items.product')
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

export const updateItemQuantity = async (req, res) => {
  try {
    const userId = req.user?.userId
    const { productId, quantity, size } = req.body

    const productValidation = validateProductId(productId)
    if (!productValidation.valid) {
      return res.status(400).json({ success: false, message: productValidation.message })
    }

    const parsedQuantity = Number(quantity)
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive integer' })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const sizeResult = getSelectedSizeEntry(product, size)
    if (!sizeResult.valid) {
      return res.status(400).json({ success: false, message: sizeResult.message })
    }

    const normalizedSize = sizeResult.hasSizes
      ? normalizeCartSize(sizeResult.selectedSize.size || size || 'ONESIZE')
      : 'ONESIZE'

    if (sizeResult.hasSizes && sizeResult.selectedSize.stock < parsedQuantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock' })
    }

    const shoppingCart = await ShoppingCart.findOne({ user: userId })
    if (!shoppingCart) {
      return res.status(404).json({ success: false, message: 'Shopping cart not found' })
    }

    const item = shoppingCart.items.find(
      (cartItem) =>
        cartItem.product.toString() === productId &&
        normalizeCartSize(cartItem.size || 'ONESIZE') === normalizedSize
    )

    if (!item) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' })
    }

    item.quantity = parsedQuantity
    shoppingCart.sum = await calculateCartSum(shoppingCart)
    await shoppingCart.save()

    res.status(200).json({
      success: true,
      message: 'Item quantity updated successfully',
      cart: await shoppingCart.populate('items.product')
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

export const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user?.userId
    const { productId, size } = req.body

    const normalizedSize = normalizeCartSize(size || 'ONESIZE')

    const productValidation = validateProductId(productId)
    if (!productValidation.valid) {
      return res.status(400).json({ success: false, message: productValidation.message })
    }

    const shoppingCart = await ShoppingCart.findOne({ user: userId })
    if (!shoppingCart) {
      return res.status(404).json({ success: false, message: 'Shopping cart not found' })
    }

    const itemIndex = shoppingCart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        normalizeCartSize(item.size || 'ONESIZE') === normalizedSize
    )

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' })
    }

    shoppingCart.items.splice(itemIndex, 1)
    shoppingCart.sum = await calculateCartSum(shoppingCart)
    await shoppingCart.save()

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      cart: await shoppingCart.populate('items.product')
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.userId

    let shoppingCart = await ShoppingCart.findOne({ user: userId })
    if (!shoppingCart) {
      shoppingCart = await ShoppingCart.create({ user: userId, items: [], sum: 0 })
    } else {
      shoppingCart.items = []
      shoppingCart.sum = 0
      await shoppingCart.save()
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: shoppingCart
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}