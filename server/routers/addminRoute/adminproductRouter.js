const express = require('express')
const router = express.Router()
const AdminProduct = require('../../models/adminModel/addminproductSchema')
const multer = require("multer");
const path = require("path");
const jwt = require('jsonwebtoken');
const { request } = require('http');

// Multer Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/adminproducts");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });


// jwt meddile ware 
const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || !decoded.adminId) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.admin = decoded;
        next();
    });
};


// addd product as the admin side
router.post('/addproduct',authenticateJWT, upload.single("productImage"), async (req, res) => {
    try {
        console.log("File:", req.file);
        console.log("Body:", req.body);

        if (!req.file) {
            return res.status(400).json({ message: "Product image is required." });
        }

        const productImage = req.file.filename;
        const { name, description } = req.body;
        const price = parseFloat(req.body.price);

        if (!name?.trim() || !description?.trim() || isNaN(price)) {
            return res.status(400).json({ message: "Required fields missing or invalid." });
        }

        const newProd = new AdminProduct({
            productImage,
            name: name.trim(),
            description: description.trim(),
            price,
            author:req.admin.adminId
        });

        const saveProd = await newProd.save();
        res.status(201).json({ msg: "Product added successfully", data: saveProd });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Data already exists" });
        }
        res.status(500).json({ msg: "Unexpected error occurred", error: err.message });
    }
});




// get api in the show all productt page
router.get('/', async(req, res) => {
    try{
        const products=await AdminProduct.find()
        res.status(200).json({msg:"show all the product",data:products})
    }
    catch(err){
        res.status(400).json({msg:"occupai some error",error:err})
    }
})


// the cerate the api in opne product like filtrer use id
router.get('/showadminproduct/:id',async(req,res)=>{
    try{
        const productId=req.params.id
        const product=await AdminProduct.findById(productId)
        res.status(200).json({msg:"product is show", data:product})
    }
    catch(err){
        res.status(400).json({msg:"occupai some error", error:err})
    }
})

module.exports = router;