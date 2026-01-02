import Product from "../models/models.js";
import multer from "multer"





export async function addProduct(req, res) {
    try {
        const newRecord = req.body;
        if (req.file) {
            newRecord.img = req.file.path.replace("\\", "/");
        }
        const product = new Product(newRecord);
        await product.save();
        return res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        return res.status(500).json({ message: "Error adding product", error: error.message });
    }
}
export async function getProducts(req, res) {

    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
}

// export async function updateProduct(req, res) {

//     try {
//         const { id } = req.params;
//         const updatedData = req.body;
//         if (!id) {
//             return res.status(400).json({ message: "ID parameter is required" });
//         }
//         if (!updatedData) {
//             return res.status(400)
//                 .json({ message: "Updated data is required" });
//         }

//         const updatedProduct = await Product.findByIdAndUpdate(
//             id,
//             updatedData,
//             { new: true }
//         );
//         if (!updatedProduct) {
//             return res.status(404).json({ message: "ID not found" });
//         }
//         return res
//             .status(200)
//             .json({ message: "Product with id " + id + " successfully updated", updatedProduct });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }


export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (req.file) {
            updatedData.img = req.file.path.replace("\\", "/");
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        );

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
        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "ID not found" });
        }
        return res
            .status(200)
            .json({ message: "Product with id " + id + " successfully deleted" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export async function checkSlug(req, res) {
    try {
        const { slug } = req.params;
        if (!slug) {
            res.status(400).json({ message: "slug required" });
            return;
        }
        const matchingSlug = await Product.findOne({ slug: slug });
        if (matchingSlug)
            return res.status(400)
                .json({ message: "Slug already exists. Choose different" })

        if (!matchingSlug)
            return res.status(200)
                .json({ message: "slug is available" })
    }
    catch (error) {
        return res.status(500)
            .json({ message: error.message });
    }
};