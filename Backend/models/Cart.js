import { Schema ,model } from "mongoose";

const cartSchema = new Schema({
    userId: { type:String, required: true },
    products: {type:String, required: true },
    quantity: {type:Number, required: true, },
},
{ timestamps: true }
);

const Cart = model("Cart", cartSchema);

export default Cart;