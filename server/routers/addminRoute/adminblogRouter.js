const express = require("express");
const router = express.Router();
const AdminBlog = require('../../models/adminModel/adminblogSchema');
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");

// Multer Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/adblgim");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// JWT Authentication Middleware
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


// POST: Add Blog add blog accodfing to th login admin with crrent tocan based 
// const mokadminId = "67ddbf6c214893d204eb2f2a"
router.post('/adminblogadd', authenticateJWT, upload.single("imagePath"), async (req, res) => {
    try {
        const imagePath = req.file ? req.file.filename : null;
        const { title, info, rate, watching } = req.body;

        if (!imagePath || !info || watching === undefined || watching === null || watching === "") {
            return res.status(400).json({ message: "Required fields missing." });
        }

        const newBlog = new AdminBlog({
            imagePath,
            title,
            info,
            rate: rate || 0,
            watching: Number(watching),
            // author: mokadminId
            author: req.admin.adminId
        });
        const savedBlog = await newBlog.save();
        res.status(201).json({ message: "Data saved successfully", data: savedBlog });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Data already exists" });
        }
        res.status(500).json({ message: "Error occurred", error: err.message });
    }
});

// GET: Show Blogs onl or he admin added blog behalf of the  login admin
router.get("/adminblogshow", authenticateJWT, async (req, res) => {
    try {
        const adminId = req.admin.adminId;
        const adminblog = await AdminBlog.find({ author: adminId }).populate("author", "username email");
        res.status(200).json(adminblog);
    } catch (err) {
        consolmie.error("Fetch error:", err);
        res.status(400).json({ message: "Error fetching blogs", error: err });
    }
});


// some create the adminblog delete api 
router.delete("/delete/:id", authenticateJWT, async (req, res) => {
    try {
        const blogId = req.params.id;

        const deletedBlog = await AdminBlog.findByIdAndDelete(blogId);

        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ message: "Blog deleted successfully", blog: deletedBlog });
    } catch (err) {
        console.error("Error deleting blog:", err);
        res.status(400).json({ message: "An error occurred", error: err });
    }
});

// fo filter the singl;e hand blog api like filter
router.get('/showpost/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await AdminBlog.findById(postId)
        res.status(200).json({ message: "post is showing", data: post })
    }
    catch (err) {
        res.status(400).json({ message: "an error occured", error: err })
    }
})


// update the post of the admin post api
router.put('/adminpostroute/:id', authenticateJWT, upload.single("imagePath"), async (req, res) => {
    try {
        const postId = req.params.id
        console.log(postId)
        const updatePost = {
            imagePath: req.file.filename,
            title: req.body.title,
            info: req.body.info,
            rate: req.body.rate,
            watching: req.body.watching,
            author: req.admin.adminId
        }
        console.log(updatePost)

        const saveAdminPost = await AdminBlog.findByIdAndUpdate(postId, updatePost, { new: true })
        if (!saveAdminPost) {
            console.log('post is not found')
        }
        res.status(200).json({ msg: "update succesfully", data: saveAdminPost })
    }
    catch (err) {
        res.status(400).json({ message: "some occupai error", error: err })
    }
})


// api crea aall the blog not th eaithenticated bas 
router.get("/adnblog", async (req, res) => {
    try {
        const adminblog = await AdminBlog.find()
        res.status(200).json({ message: "dayta is", data: adminblog })
    }
    catch (err) {
        res.status(400).json({ message: "occupai some error", error: err })
    }
})



module.exports = router;
