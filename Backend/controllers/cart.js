import Cart from "../models/Cart.js";

/* GET CART */
export async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ userId: req.userId })
      .populate("products.productId");

    if (!cart) return res.json({ products: [] });

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

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.products.find(
      p => p.productId.toString() === productId
    );

    if (!item) return res.status(404).json({ message: "Product not found" });

    if (type === "inc") item.quantity += 1;
    if (type === "dec" && item.quantity > 1) item.quantity -= 1;

    await cart.save();

    // 🔥🔥 VERY IMPORTANT
    const populatedCart = await Cart.findOne({ userId: req.userId })
      .populate("products.productId");

    res.json(populatedCart);

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

    // 🔥 populate again
    const cart = await Cart.findOne({ userId: req.userId })
      .populate("products.productId");

    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function addtoCart(req, res) {
  try {
    const { productId, qty } = req.body;
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      // create new cart
      cart = new Cart({
        userId: req.userId,
        products: [{ productId, quantity: qty }]
      });
    }
    else {
      // check if product exists  in cart
      const itemIndex = cart.products.findIndex(
        p => p.productId.toString() === productId
      );
      if (itemIndex > -1) {

        // product exists in cart, update qty
        cart.products[itemIndex].quantity += qty;
      }
      else {
        // product not in cart, add new item
        cart.products.push({ productId, quantity: qty });
      }
    }
    await cart.save();
    // 🔥 populate agai
    //          VERY IMPORTANT
    const populatedCart = await Cart.findOne({ userId: req.userId })
      .populate("products.productId");
    res.json(populatedCart);
  }
  catch (err) {
    res.status(500).json({ message: err.message });

  }

}



