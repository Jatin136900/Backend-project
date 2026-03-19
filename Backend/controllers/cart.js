import Cart from "../models/Cart.js";

async function getNormalizedCart(userId) {
  let cart = await Cart.findOne({ userId }).populate("products.productId");

  if (!cart) {
    return null;
  }

  const validProducts = cart.products.filter((item) => item.productId);

  if (validProducts.length !== cart.products.length) {
    cart.products = validProducts.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));
    await cart.save();
    cart = await Cart.findOne({ userId }).populate("products.productId");
  }

  return cart;
}

/* GET CART */
export async function getCart(req, res) {
  try {
    const cart = await getNormalizedCart(req.userId);

    if (!cart) {
      return res.json({ products: [] });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* UPDATE QTY */
export async function updateQty(req, res) {
  try {
    const { productId, type } = req.body;

    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.products.find(
      (product) => product.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (type === "inc") {
      item.quantity += 1;
    }

    if (type === "dec" && item.quantity > 1) {
      item.quantity -= 1;
    }

    await cart.save();

    const normalizedCart = await getNormalizedCart(req.userId);
    res.json(normalizedCart || { products: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function removeItem(req, res) {
  try {
    const { productId } = req.params;

    await Cart.findOneAndUpdate(
      { userId: req.userId },
      { $pull: { products: { productId } } }
    );

    const cart = await getNormalizedCart(req.userId);
    res.json(cart || { products: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function addtoCart(req, res) {
  try {
    const { productId, qty } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const quantity = Number(qty) > 0 ? Number(qty) : 1;
    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      cart = new Cart({
        userId: req.userId,
        products: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();

    const normalizedCart = await getNormalizedCart(req.userId);
    res.json(normalizedCart || { products: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
