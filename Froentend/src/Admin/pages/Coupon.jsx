import React, { useEffect, useState } from "react";
import instance from "../../axios.Config";

const AddCoupon = () => {
  const [form, setForm] = useState({
    code: "",
    discount: "",
    startDate: "",
    expiryDate: "",
  });

  const [message, setMessage] = useState("");
  const [coupons, setCoupons] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  /* ======================
     HANDLE INPUT
  ====================== */
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "code") {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    }

    setForm({ ...form, [name]: value });
  };

  /* ======================
     ADD COUPON
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance.post("/coupon/add", form);
      setMessage("Coupon added successfully");
      setForm({ code: "", discount: "", startDate: "", expiryDate: "" });
      fetchCoupons();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add coupon");
    }
  };

  /* ======================
     FETCH COUPONS
  ====================== */
  const fetchCoupons = async () => {
    const res = await instance.get("/coupon");
    setCoupons(res.data);
  };

  /* ======================
     DELETE COUPON
  ====================== */
  const deleteCoupon = async (id) => {
    await instance.delete(`/coupon/${id}`);
    fetchCoupons();
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Add Coupon</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl"
      >
        <input
          type="text"
          name="code"
          placeholder="COUPON CODE"
          value={form.code}
          onChange={handleChange}
          required
          className="border px-4 py-2 rounded-lg"
        />

        <input
          type="number"
          name="discount"
          placeholder="Discount %"
          value={form.discount}
          onChange={handleChange}
          required
          min={1}
          max={100}
          className="border px-4 py-2 rounded-lg"
        />

        <input
          type="date"
          name="startDate"
          min={today}
          value={form.startDate}
          onChange={handleChange}
          required
          className="border px-4 py-2 rounded-lg"
        />

        <input
          type="date"
          name="expiryDate"
          min={form.startDate || today}
          value={form.expiryDate}
          onChange={handleChange}
          required
          className="border px-4 py-2 rounded-lg"
        />

        <button
          type="submit"
          className="lg:col-span-4 bg-orange-600 text-white py-3 rounded-lg font-semibold"
        >
          Add Coupon
        </button>
      </form>

      {message && (
        <p className={`mt-4 ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}

      {/* COUPON LIST */}
      <div className="mt-10 bg-white rounded-xl shadow p-6 max-w-5xl">
        <h3 className="text-lg font-semibold mb-4">All Coupons</h3>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Start</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3 font-semibold">{c.code}</td>
                <td className="p-3">{c.discount}%</td>
                <td className="p-3">{c.startDate.slice(0, 10)}</td>
                <td className="p-3">{c.expiryDate.slice(0, 10)}</td>
                <td className="p-3">
                  <button
                    onClick={() => deleteCoupon(c._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No coupons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddCoupon;
