// import axios from "axios";
// import React, { useState } from "react";
// import instance from "../../axios.Config";

// function AddProduct() {
//   const [data, setData] = useState({
//     name: "",
//     slug: "",
//     category: "",
//     description: "",
//     originalPrice: "",
//     discountedPrice: "",
//     image: null
//   });

//   // ✅ EMPTY FORM STATE (sirf reset ke liye)
//   const emptyForm = {
//     name: "",
//     slug: "",
//     category: "",
//     description: "",
//     originalPrice: "",
//     discountedPrice: "",
//     image: null
//   };

//   function handleChange(e) {
//     const { name, value, files } = e.target;

//     if (name === "image") {
//       setData({ ...data, image: files[0] });
//     } else {
//       setData({ ...data, [name]: value });
//     }
//   }

//   function createSlug(e) {
//     const nameValue = e.target.value;
//     if (!nameValue) return;

//     const slug = nameValue
//       .toLowerCase()
//       .replace(/\s+/g, "-")
//       .replace(/[^a-z0-9-]/g, "-");

//     setData({ ...data, slug });
//     document.querySelector("#slug")?.focus();
//   }

//   async function checkSlug(e) {
//     const slug = e.target.value;
//     if (!slug) return;

//     try {
//       const response = await instance.get(
//         "product/checkSlug/" + slug,
//         { withCredentials: true }
//       );

//       // ✅ 200 means slug is available
//       if (response.status === 200) {
//         console.log("Slug available");
//         // optional: success UI
//       }

//     } catch (err) {
//       // ❌ 400 means slug exists
//       if (err.response?.status === 400) {
//         console.warn("Slug already exists! Please choose another one.");
//       } else {
//         console.error("Slug check failed", err);
//       }
//     }
//   }


//   async function handleSubmit(e) {
//     e.preventDefault();

//     const product = new FormData();
//     Object.keys(data).forEach((key) => {
//       product.append(key, data[key]);
//     });

//     try {
//       const response = await instance.post(
//         "product",
//         product,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       console.log("Product Added:", response.data);
//       console.log("Product added successfully!");

//       // ✅ FORM RESET (ONLY ADDITION)
//       setData(emptyForm);
//       e.target.reset();

//     } catch (error) {
//       console.error(error);
//       console.error("Something went wrong!", error);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center p-4">
//       <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
//           Add a New Product
//         </h2>

//         <form
//           onSubmit={handleSubmit}
//           encType="multipart/form-data"
//           className="grid grid-cols-1 md:grid-cols-2 gap-6"
//         >
//           {/* NAME */}
//           <div className="flex flex-col">
//             <label className="font-medium mb-1">Name</label>
//             <input
//               type="text"
//               placeholder="Enter product name"
//               name="name"
//               value={data.name}
//               onChange={handleChange}
//               onBlur={createSlug}
//               className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* SLUG */}
//           <div className="flex flex-col">
//             <label className="font-medium mb-1">Slug</label>
//             <input
//               id="slug"
//               type="text"
//               name="slug"
//               value={data.slug}
//               onBlur={checkSlug}
//               readOnly
//               className="border rounded-lg px-3 py-2 bg-gray-200 cursor-not-allowed"
//             />
//           </div>

//           {/* CATEGORY */}
//           <div className="flex flex-col">
//             <label className="font-medium mb-1">Category</label>
//             <input
//               type="text"
//               name="category"
//               value={data.category}
//               onChange={handleChange}
//               className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* ORIGINAL PRICE */}
//           <div className="flex flex-col">
//             <label className="font-medium mb-1">Original Price</label>
//             <input
//               type="number"
//               name="originalPrice"
//               value={data.originalPrice}
//               onChange={handleChange}
//               className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* DISCOUNTED PRICE */}
//           <div className="flex flex-col">
//             <label className="font-medium mb-1">Discounted Price</label>
//             <input
//               type="number"
//               name="discountedPrice"
//               value={data.discountedPrice}
//               onChange={handleChange}
//               className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* IMAGE */}
//           <div className="flex flex-col">
//             <label className="font-medium mb-1">Product Image</label>
//             <input
//               type="file"
//               name="image"
//               accept="image/*"
//               onChange={handleChange}
//               className="border rounded-lg px-3 py-2"
//             />
//           </div>

//           {/* DESCRIPTION */}
//           <div className="md:col-span-2 flex flex-col">
//             <label className="font-medium mb-1">Description</label>
//             <textarea
//               name="description"
//               value={data.description}
//               onChange={handleChange}
//               className="border rounded-lg px-3 py-2 h-28 resize-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* BUTTON */}
//           <div className="md:col-span-2 flex justify-center">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full md:w-1/2"
//             >
//               Add Product
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddProduct;


import { useState } from "react";
import instance from "../../axios.Config";

function AddProduct() {
  const [data, setData] = useState({
    name: "",
    slug: "",
    category: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    img: null,
  });

  // ✅ EMPTY FORM STATE (sirf reset ke liye)
  const emptyForm = {
    name: "",
    slug: "",
    category: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    img: null,
  };

  function handleChange(e) {
    if (e.target.name === "img") {
      setData({ ...data, img: e.target.files[0] });
    } else {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
    }
  }

  function createSlug(e) {
    const nameValue = e.target.value;
    if (!nameValue) return;

    const slug = nameValue
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "-");

    setData({ ...data, slug });
    document.querySelector("#slug")?.focus();
  }

  async function checkSlug(e) {
    const slug = e.target.value;
    if (!slug) return;

    try {
      const response = await instance.get("product/checkSlug/" + slug, {
        withCredentials: true,
      });

      // ✅ 200 means slug is available
      if (response.status === 200) {
        console.log("Slug available");
        // optional: success UI
      }
    } catch (err) {
      // ❌ 400 means slug exists
      if (err.response?.status === 400) {
        console.warn("Slug already exists! Please choose another one.");
      } else {
        console.error("Slug check failed", err);
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const product = new FormData();
    Object.keys(data).forEach((key) => {
      product.append(key, data[key]);
    });

    // for (let [key, value] of product.entries()) {
    //   console.log(`${key}:`, value);
    // }

    try {
      const response = await instance.post("product", product, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      console.log("Product Added:", response.data);
      console.log("Product added successfully!");
      // ✅ FORM RESET (ONLY ADDITION)
      setData(emptyForm);
      e.target.reset();
    } catch (error) {
      console.error(error);
      console.error("Something went wrong!", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Add a New Product
        </h2>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* NAME */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              name="name"
              value={data.name}
              onChange={handleChange}
              onBlur={createSlug}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* SLUG */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Slug</label>
            <input
              id="slug"
              type="text"
              name="slug"
              value={data.slug}
              onBlur={checkSlug}
              readOnly
              className="border rounded-lg px-3 py-2 bg-gray-200 cursor-not-allowed"
            />
          </div>

          {/* CATEGORY */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={data.category}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ORIGINAL PRICE */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Original Price</label>
            <input
              type="number"
              name="originalPrice"
              value={data.originalPrice}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* DISCOUNTED PRICE */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Discounted Price</label>
            <input
              type="number"
              name="discountedPrice"
              value={data.discountedPrice}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* IMAGE */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Product Image</label>
            <input
              type="file"
              name="img"
              accept="image/*"
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2 flex flex-col">
            <label className="font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 h-28 resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* BUTTON */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full md:w-1/2"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
