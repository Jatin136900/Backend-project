import { Schema, model } from "mongoose";

const authSchema = new Schema({
    name: { type: String, },
    email: { type: String, required: true, unique: true },
    username: { type: String, sparse: true, unique: true, min: 4, max: 30 },
    phone: { type: Number, sparse: true, unique: true },
    password: { type: String, min: 8, max: 60 },
    image: { type: String },
    role: { type: String },
    authProvider: { type: String, enum: ["local", "google"], default: "local", },
    googleId: { type: String, unique: true, sparse: true },
});

const Auth = model("auth", authSchema, "auth");
export default Auth;
