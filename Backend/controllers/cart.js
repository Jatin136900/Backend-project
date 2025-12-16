import Cart from "../models/cart.js";

export async function addtoCart(req, res) {
    try {
        const data = req.body;
        data.userId = req.userId;

        const productInCart = new Cart(data);
        await productInCart.save();
        return res.status(201).json({ message: "product added to cart successfully", product: productInCart });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};