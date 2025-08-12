const express = require('express')
const router = express.Router()
const Admin = require('../../models/adminModel/addminSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//aded amdin user
router.post('/adminreg', async (req, res) => {
    try {
        const { username, email, password,confpassword } = req.body;
        if(password!==confpassword){
            return res.status(400).json({message:"password do not match"})
        }

        const existAdmin= await Admin.findOne({email})
        if(existAdmin){
            return res.status(400).json({message:"admin is alread existed"})
        }

        // Hash the password before saving
        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const admin = new Admin({
            username,
            email,
            password: hashedPassword  // addinbg hash password
        });
        await admin.save();
        res.status(200).json({ message: "Admin added successfully", admin });
    } catch (err) {
        res.status(400).json({ message: "An error occurred", error: err.message });
    }
});


// show addmin user
router.get('/showadmin', async (req, res) => {
    try {
        const admins = await Admin.find()
        res.status(201).json({ message: "data is this", admins })
    }
    catch (err) {
        res.status(400).json({ message: "occupai some error", err })
    }
});


// login admin jwt authentication 
router.post("/adminlogin", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Ensure the admin is found in the database
        const admin = await Admin.findOne({ username });
        console.log(admin)

        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if the password is valid
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        // Create JWT token
        // const token = jwt.sign(
        //     { username: admin.username, userId: admin._id },
        //     process.env.JWT_SECRET,
        //     { expiresIn: process.env.JWT_EXPIRATION || '1h' }
        // );

        const token = jwt.sign(
            {adminId: admin._id }, // THIS MUST MATCH your authenticateJWT
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION}
        );

        // Send the response with token
        res.status(200).json({ message: "Login successful", token });
    }
    catch (err) {
        // Handle any errors that occur during the process
        console.error(err);
        res.status(500).json({ message: "An error occurred" });
    }
});

// const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


// autentication jwt middlewarte
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer', '').trim(); // Trim to avoid leading/trailing spaces
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' }); // Fixed: Unauthorized as a string message
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' }); // Changed to a string message
        }
        req.admin = admin;
        next();
    });
};


// admin profile show API
router.get('/adminprofile', authenticateJWT, (req, res) => {
    res.status(200).json({ message: 'Profile information', admin: req.admin })
});

module.exports = router;


