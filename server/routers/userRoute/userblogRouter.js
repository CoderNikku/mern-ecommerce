const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const fs = require("fs")
const Userblog = require("../../models/userModel/userblogSchema");
const { title } = require("process");
require("dotenv").config();

//  Ensure uploads directory exists
const uploadDir = "uploads/userimages";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

//  Multer file storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});


const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error("Only images (jpeg, jpg, png) are allowed."));
    }
});


//  JWT middleware
const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log("Authorization Header:", authHeader); // Add this line
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log(" No Authorization header or wrong format");
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(" JWT verification failed:", err.message);
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        if (!decoded.userId) {
            console.log(" Token does not contain userId");
            return res.status(403).json({ message: "Invalid token payload" });
        }
        console.log("Authenticated user:", decoded.userId);
        req.user = decoded;
        next();
    });
};

// const SECRET ="superSuperSecret"
// const authenticateJWT = (req, res, next) => {
// }

// menual id enter and check
// const mockUserId = "6822141004c8b9aaea382802"; // Example ObjectId

//  POST add blog
router.post('/useraddblog', authenticateJWT, upload.single("imagePath"), async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded." });
        }
        const imagePath = req.file.filename;
        const newBlog = new Userblog({
            title,
            description,
            imagePath,
            // author: mockUserId   // like some menual enyter id
            author: req.user.userId
        });
        const savedBlog = await newBlog.save();
        res.status(201).json({ message: "Blog saved successfully", data: savedBlog });

    } catch (err) {
        console.error(" Error saving blog:", err);
        res.status(500).json({ message: "Error saving blog", error: err.message });
    }
});


// GET all blogs
// Add this in your router after authenticateJWT middleware
router.get('/myblogs', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.userId;
        const userBlogs = await Userblog.find({ author: userId }).populate("author", "username email");
        res.status(200).json(userBlogs);
    } catch (err) {
        console.error("Error fetching user blogs:", err);
        res.status(500).json({ message: "Error fetching user blogs", error: err.message });
    }
});

// call userblog wshow n without a=authentication api
router.get('/', async (req, res) => {
    try {
        const userblogs = await Userblog.find()
        res.status(200).json({ message: "the blogs is showing", data: userblogs })
    }
    catch (err) {
        res.status(400).json({ message: "occupai some error", error: err })
    }
})


// get teh id abs shoiw single blog api
router.get('/showuserblog/:id', async (req, res) => {
    try {
        const blogId = req.params.id
        const blog = await Userblog.findById(blogId)
        res.status(200).json({ message: "show the data", data: blog })
    }
    catch (err) {
        res.status(400).json({ message: "occupai some error", error: err })
    }
});


// delete th4e item for create the api
router.delete('/deleteblog/:id', async (req, res) => {
    try {
        const blogId = req.params.id
        const deleteblog = await Userblog.findByIdAndDelete(blogId)
        res.status(200).json({ msg: "item is deleted", data: deleteblog })
    }
    catch (err) {
        res.status(400).json({ msg: "deleted the blog", error: err })
    }
})

// updasate the date blog api
router.put('/userblogup/:id', authenticateJWT, upload.single("imagePath"), async (req, res) => {
    try {
        const blogId = req.params.id;
        console.log(blogId)
        // const imagePath=req.file.filename
        const updateData = {
            imagePath:req.file.filename,
            title: req.body.title,
            description: req.body.description,
            author: req.user.userId
        };

        console.log(updateData)
        const updatedBlog = await Userblog.findByIdAndUpdate(blogId, updateData, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ msg: "Blog not found" });
        }
        res.status(200).json({ msg: "Blog updated successfully", data: updatedBlog });
    } catch (err) {
        res.status(500).json({ msg: "Failed to update blog", error: err.message });
    }
});

module.exports = router;



