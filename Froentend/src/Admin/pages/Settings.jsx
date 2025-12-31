import { useEffect, useState } from "react";
import instance from "../../axios.Config";
import { Pencil, Trash2 } from "lucide-react";

export default function Settings() {
  const [products, setProducts] = useState([]);
  const FRONTEND_URL = import.meta.env.VITE_BASEURL;


  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const res = await instance.get("/product");
    setProducts(res.data);

  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Products Management
        </h2>

        <button className="bg-orange-600 text-white px-5 py-2 rounded-lg shadow hover:bg-orange-700">
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Product ID</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p._id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* Product Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={`${FRONTEND_URL}/${p.img}`}
                      alt={p.name}
                      className="w-14 h-14 rounded-lg object-cover border"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {p.category}
                  </span>
                </td>

                {/* Price */}
                <td className="px-6 py-4">
                  <p className="text-green-600 font-semibold">
                    ₹{p.discountedPrice}
                  </p>
                  <p className="text-xs line-through text-gray-400">
                    ₹{p.originalPrice}
                  </p>
                </td>

                {/* Slug */}
                <td className="px-6 py-4 text-xs text-gray-500">
                  {p.slug}
                </td>

                {/* ID */}
                <td className="px-6 py-4 text-xs text-gray-400">
                  {p._id}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                      <Pencil size={16} />
                    </button>
                    <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
