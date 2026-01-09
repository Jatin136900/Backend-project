import cloudinary from "../middlewares/cloudinary.js";
import Product from "../models/models.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export async function addProduct(req, res) {
    try {
        let newRecord = req.body;
        if (req.file) {
            //   console.log("file", req.file);
            //   newRecord.img = req.file.path.replace("\\", "/");
            const result = await uploadToCloudinary(req.file.path);
            //   console.log("result", result);
            newRecord.img = result.data.secure_url;
        }
        console.log("newRecord", newRecord);
        const product = new Product(newRecord);
        console.log("product", product);
        await product.save();
        return res
            .status(201)
            .json({ message: "Product added successfully", product });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Error adding product", error: error.message });
    }
}

// export async function getProducts(req, res) {
//     try {
//         const products = await Product.find();
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({
//             message: "Error fetching products",
//             error: error.message,
//         });
//     }
// }



export async function getProducts(req, res) {
    try {
        let filter = {};

        // 🔥 category query aayi ho to filter lagao
        if (req.query.category) {
            filter.category = req.query.category;
        }

        const products = await Product.find(filter);
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching products",
            error: error.message,
        });
    }
}


export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (req.file) {
            updatedData.img = req.file.path.replace("\\", "/");
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
            new: true,
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "ID not found" });
        }

        return res.status(200).json({
            message: "Product successfully deleted",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function checkSlug(req, res) {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({ message: "slug required" });
        }

        const matchingSlug = await Product.findOne({ slug });

        if (matchingSlug) {
            return res
                .status(400)
                .json({ message: "Slug already exists. Choose different" });
        }

        return res.status(200).json({ message: "slug is available" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
