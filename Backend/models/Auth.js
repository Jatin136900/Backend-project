import { Schema, model } from "mongoose";

const authSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true, min: 4, max: 30 },
    phone: { type: Number, required: true, unique: true },
    password: { type: String, required: true, min: 8, max: 60 },
    image: { type: String },
    role: { type: String },
});

const Auth = model("auth", authSchema, "auth");
export default Auth;
