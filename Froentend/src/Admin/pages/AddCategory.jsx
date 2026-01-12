// import { useState } from "react";
// import instance from "../../axios.Config";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function AddCategory() {
//   const [data, setData] = useState({ name: "", slug: "" });

//   const createSlug = (e) => {
//     const value = e.target.value;
//     const slug = value
//       .toLowerCase()
//       .replace(/\s+/g, "-")
//       .replace(/[^a-z0-9-]/g, "-");
//     setData({ name: value, slug });
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       await instance.post("category", data, { withCredentials: true });

//       // ✅ SUCCESS TOAST
//       toast.success("Category added successfully!");

//       setData({ name: "", slug: "" });
//     } catch (error) {
//       // ❌ ERROR TOAST
//       if (error.response?.status === 400) {
//         toast.error("Category already exists!");
//       } else {
//         toast.error("Something went wrong!");
//       }
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* 🔥 TOAST CONTAINER */}
//       <ToastContainer position="top-right" autoClose={2000} />

//       <h2 className="text-xl font-bold mb-4">Add Category</h2>

//       <form onSubmit={submitHandler} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Category Name"
//           value={data.name}
//           onChange={createSlug}
//           className="border p-2 w-full"
//         />

//         <input
//           type="text"
//           value={data.slug}
//           readOnly
//           className="border p-2 w-full bg-gray-200"
//         />

//         <button className="bg-orange-600 text-white px-4 py-2 rounded">
//           Add Category
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AddCategory;


import { useEffect, useState } from "react";
import instance from "../../axios.Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddCategory() {
  const [data, setData] = useState({ name: "", slug: "" });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  /* AUTO CREATE SLUG */
  const createSlug = (e) => {
    const value = e.target.value;
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    setData({ name: value, slug });
  };

  /* FETCH ALL CATEGORIES */
  const fetchCategories = async () => {
    try {
      const res = await instance.get("/category");
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ADD CATEGORY */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!data.name || !data.slug) {
      return toast.error("All fields required");
    }

    try {
      setLoading(true);
      await instance.post("/category", data, {
        withCredentials: true,
      });

      toast.success("Category added successfully");
      setData({ name: "", slug: "" });
      fetchCategories(); // refresh list
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Category already exists");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  /* DELETE CATEGORY */
  const deleteCategory = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirm) return;

    try {
      await instance.delete(`/category/${id}`, {
        withCredentials: true,
      });

      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ADD CATEGORY */}
      <h2 className="text-xl font-bold mb-4">Add Category</h2>

      <form onSubmit={submitHandler} className="space-y-4 mb-10">
        <input
          type="text"
          placeholder="Category Name"
          value={data.name}
          onChange={createSlug}
          className="border p-2 w-full"
        />

        <input
          type="text"
          value={data.slug}
          readOnly
          className="border p-2 w-full bg-gray-200"
        />

        <button
          disabled={loading}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>

      {/* CATEGORY LIST */}
      <h3 className="text-lg font-semibold mb-4">All Categories</h3>

      {categories.length === 0 ? (
        <p className="text-gray-500">No categories found</p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-sm text-gray-500">{cat.slug}</p>
              </div>

              <button
                onClick={() => deleteCategory(cat._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddCategory;
