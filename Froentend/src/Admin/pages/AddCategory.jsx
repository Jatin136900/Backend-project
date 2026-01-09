import { useState } from "react";
import instance from "../../axios.Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddCategory() {
  const [data, setData] = useState({ name: "", slug: "" });

  const createSlug = (e) => {
    const value = e.target.value;
    const slug = value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "-");
    setData({ name: value, slug });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await instance.post("category", data, { withCredentials: true });

      // ✅ SUCCESS TOAST
      toast.success("Category added successfully!");

      setData({ name: "", slug: "" });
    } catch (error) {
      // ❌ ERROR TOAST
      if (error.response?.status === 400) {
        toast.error("Category already exists!");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="p-6">
      {/* 🔥 TOAST CONTAINER */}
      <ToastContainer position="top-right" autoClose={2000} />

      <h2 className="text-xl font-bold mb-4">Add Category</h2>

      <form onSubmit={submitHandler} className="space-y-4">
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

        <button className="bg-orange-600 text-white px-4 py-2 rounded">
          Add Category
        </button>
      </form>
    </div>
  );
}

export default AddCategory;
