import React, { useState } from "react";
import instance from "../../axios.Config";

const AddCoupon = () => {
  const [form, setForm] = useState({
    code: "",
    discount: "",
    startDate: "",
    expiryDate: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance.post("/coupon/add", form);
      setMessage("Coupon added successfully");
      setForm({ code: "", discount: "", startDate: "", expiryDate: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add coupon");
    }
  };

  return (
    <div className="p-6">
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Add Coupon
      </h2>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl"
      >
        <input
          type="text"
          name="code"
          placeholder="Coupon Code"
          value={form.code}
          onChange={handleChange}
          required
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          type="number"
          name="discount"
          placeholder="Discount %"
          value={form.discount}
          onChange={handleChange}
          required
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          required
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Button */}
        <button
          type="submit"
          className="col-span-1 md:col-span-2 lg:col-span-4 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          Add Coupon
        </button>
      </form>

      {/* Message */}
      {message && (
        <p
          className={`mt-4 text-sm font-medium ${
            message.includes("success")
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddCoupon;
