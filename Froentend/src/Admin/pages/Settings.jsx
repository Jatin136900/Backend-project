import { useEffect, useState } from "react";
import instance from "../../axios.Config";
import { Pencil, Trash2, ArrowUpRight } from "lucide-react";

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
            {/* IMAGE STRIP */}
            <div className="w-24 h-24 shrink-0">
              <img
                src={`${FRONTEND_URL}/${p.img}`}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="flex-1 px-5 py-4">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-gray-800">
                  {p.name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {p.category}
                </span>
              </div>

              <p className="text-xs text-gray-500 line-clamp-1">
                {p.description}
              </p>

              <p className="text-[11px] text-gray-400 mt-1">
                {p.slug}
              </p>
            </div>

            {/* PRICE */}
            <div className="px-6 text-right">
              <p className="text-green-600 font-bold">
                ₹{p.discountedPrice}
              </p>
              <p className="text-xs text-gray-400 line-through">
                ₹{p.originalPrice}
              </p>
            </div>

            {/* ACTION SLIDE */}
            <div className="absolute right-0 top-0 h-full flex items-center gap-2 px-4 bg-gradient-to-l from-white via-white to-transparent opacity-0 group-hover:opacity-100 transition">
              <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                <Pencil size={16} />
              </button>
              <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                <Trash2 size={16} />
              </button>
              <button className="p-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800">
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
