import { Schema, model } from "mongoose";


const productSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    description: { type: String, required: true },
    img: { type: String, required: true },

});

const Product = model("Product", productSchema);

export default Product;