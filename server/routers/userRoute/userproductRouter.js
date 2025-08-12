const express = require('express');
const router = express.Router();
const Userproduct =require('../../models/userModel/userproductSchema')
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Added to handle directory creation
require('dotenv').config();



// create the api in the Userproduct
router.get('/', (req,res)=>{
    res.send("api in created")
})

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/userproductimages'); // Use the upload directory
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname); // Generate a unique filename
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });

// POST API for adding a product
router.post('/useraddprod', upload.single("imagePath"), async (req, res) => {
    try {
        const { name, description, price, imagePath} = req.body;
        console.log("befor coversionPrice type and value:", typeof price, price); // Debugging
        
        // const imagePath = req.file ? req.file.filename : null;
        console.log(req.file); // Debugging: Check if the file is uploaded

        // Validate required fields
        if (!name || !description || !price) {
            return res.status(400).json({ message: "Name, description, and price are required" });
        }
        // Validate that price is a valid number
        const intPrice = Number(price);
        if (isNaN(intPrice) || intPrice <= 0) {
            return res.status(400).json({ message: "Price must be a valid positive number" });
        }
        console.log("Price type and value:", typeof intPrice, intPrice); // Debugging

        if (!imagePath) {
            return res.status(400).json({ message: "Image is not uploaded" });
        }

        // Create a new product
        const newProduct = new Userproduct({
            name,
            description, 
            price: intPrice,
            imagePath,
        });
        console.log("New Product:", newProduct); // Debugging

        await newProduct.save(); // Save the product to the database
        res.status(201).json({ message: "Product added successfully", newProduct });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(400).json({ message: "Error occurred", error: err.message });
    }
});


module.exports = router;