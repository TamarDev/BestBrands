import uploadToCloudinary from "../Utils/UploadToCloudinary.js";
import Brands from '../Models/Brands.js';

export const getAllBrands = async (req, res) => {
    try {
        const brands = await Brands.find({});
        res.status(200).json(brands);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getBrandById = async (req, res) => {
    try {
        const id = req.params.id;
        const brand = await Brands.findById(id);

        if (!brand)
            return res.status(404).json({ message: "Brand not found" });

        res.status(200).json(brand);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getBrandByName = async (req, res) => {
    try {
        const name = req.params.name;
        const brand = await Brands.findOne({ name: name });

        if (!brand)
            return res.status(404).json({ message: "Brand not found" });

        res.status(200).json(brand);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// =========================
// ADD BRAND
// =========================

export const addBrand = async (req, res) => {
    try {
        const { name, description, inventor } = req.body;

        let image;
        let imagePage;

        // תמונה רגילה
        if (req.files?.image?.[0]) {
            const result = await uploadToCloudinary(
                req.files.image[0].buffer
            );

            image = result.secure_url;
        }

        // תמונת דף המותג
        if (req.files?.imagePage?.[0]) {
            const result = await uploadToCloudinary(
                req.files.imagePage[0].buffer
            );

            imagePage = result.secure_url;
        }

        const newBrand = new Brands({
            name,
            image,
            imagePage,
            description,
            inventor,
        });

        await newBrand.save();

        return res.status(201).json({
            message: "The Brand was added",
            brand: newBrand,
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};


// =========================
// UPDATE BRAND
// =========================

export const UpdateBrand = async (req, res) => {
    try {

        const updateData = {
            ...req.body
        };

        // תמונה רגילה
        if (req.files?.image?.[0]) {
            const result = await uploadToCloudinary(
                req.files.image[0].buffer
            );

            updateData.image = result.secure_url;
        }

        // תמונת דף המותג
        if (req.files?.imagePage?.[0]) {
            const result = await uploadToCloudinary(
                req.files.imagePage[0].buffer
            );

            updateData.imagePage = result.secure_url;
        }

        const update = await Brands.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!update)
            return res.status(404).json({
                message: "Brand not found"
            });

        return res.status(200).json({
            message: "Brand updated successfully",
            brand: update
        });

    }
    catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};


export const deleteBrand = async (req, res) => {
    const id = req.params.id;

    try {
        const deleted = await Brands.findByIdAndDelete(id);

        if (!deleted)
            return res.status(404).json({
                message: "Brand not found"
            });

        res.status(200).json({
            message: "Brand deleted successfully",
            brand: deleted
        });

    }
    catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};