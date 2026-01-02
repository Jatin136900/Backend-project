import { useEffect, useState } from "react";
import instance from "../../axios.Config";
import { Pencil, Trash2, ArrowUpRight, X } from "lucide-react";

export default function Settings() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const FRONTEND_URL = import.meta.env.VITE_BASEURL;

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const res = await instance.get("/product");
    setProducts(res.data);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product permanently?")) return;
    await instance.delete(`/product/${id}`);
    fetchProducts();
  }

  /* ================= EDIT FLOW ================= */

  function openEditModal(product) {
    setEditProduct(product);
    setFormData(product);
    setImagePreview(`${FRONTEND_URL}/${product.img}`);
  }

  function closeModal() {
    setEditProduct(null);
    setFormData({});
    setImagePreview(null);
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleUpdate() {
    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append(
        "discountedPrice",
        Number(formData.discountedPrice)
      );
      data.append("description", formData.description);

      // ✅ IMAGE KEY MATCH MULTER
      if (formData.image) {
        data.append("img", formData.image);
      }

      await instance.put(`/product/${editProduct._id}`, data);

      alert("Product updated successfully ✅");
      closeModal();
      fetchProducts();
    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data || err.message);
      alert("Update failed ❌");
    }
  }



  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Product Control Center
        </h2>
        <p className="text-gray-500 text-sm">
          Fast access to all products & operations
        </p>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {products.map((p) => (
          <div
            key={p._id}
            className="group relative flex items-center bg-white border rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            {/* IMAGE */}
            <div className="w-24 h-24 shrink-0">
              <img
                src={`${FRONTEND_URL}/${p.img}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="flex-1 px-5 py-4">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-xs text-gray-500">{p.description}</p>
            </div>

            {/* PRICE */}
            <div className="px-6 text-right">
              <p className="text-green-600 font-bold">
                ₹{p.discountedPrice}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="absolute right-0 top-0 h-full flex gap-2 px-4 items-center opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => openEditModal(p)}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => handleDelete(p._id)}
                className="p-2 bg-red-50 text-red-600 rounded-lg"
              >
                <Trash2 size={16} />
              </button>

              <button
                onClick={() => window.open(`/product/${p.slug}`, "_blank")}
                className="p-2 bg-gray-900 text-white rounded-lg"
              >
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <h3 className="text-xl font-bold mb-4">Edit Product</h3>

            {/* IMAGE */}
            <img
              src={imagePreview}
              className="w-full h-40 object-cover rounded mb-3"
            />

            <input type="file" onChange={handleImageChange} />

            {/* INPUTS */}
            <input
              className="w-full border p-2 mt-3"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Name"
            />

            <input
              className="w-full border p-2 mt-3"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              placeholder="Category"
            />

            <input
              className="w-full border p-2 mt-3"
              name="discountedPrice"
              value={formData.discountedPrice || ""}
              onChange={handleChange}
              placeholder="Price"
            />

            <textarea
              className="w-full border p-2 mt-3"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Description"
            />

            <button
              onClick={handleUpdate}
              className="w-full bg-black text-white py-2 rounded-lg mt-4"
            >
              Update Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
