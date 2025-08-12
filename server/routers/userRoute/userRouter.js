const express = require('express')
const router = express.Router()
const User = require('../../models/userModel/userSchema')
const Userblog = require('../../models/userModel/userblogSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config



router.post('/adduser', async (req, res) => {
    try {
        const { username, email, password, confpassword } = req.body;
        // Check if passwords match
        if (password !== confpassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }


        // Hash the password
        const salt = await bcrypt.genSalt(10); // Create a salt
        const hashedPassword = await bcrypt.hash(password, salt); //

        // Create a new user
        const user = new User({ username, email, password: hashedPassword });
        await user.save(); //othe used: users.push(user) bt firt to user=[] create starting 
        // Respond with success
        res.status(201).json({ message: "User added successfully", user });

    } catch (err) {
        res.status(500).json({ message: "Error adding user", err });
    }
});

// get the all user 
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    }
    catch (err) {
        res.status(201).json({ message: "error occpai", err })
    }
});


// login user api using awt  tokken athentication 
router.post('/loginuser', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // 3. Generate JWT
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '1h' }
        );

        // 4. Return token and userId
        return res.status(200).json({
            message: "Login successful",
            token,
            userId: user._id // Send userId directly
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server error during login" });
    }
});





// middleware to check jwt token
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (blacklistedTokens.includes(token)) {
        return res.status(403).json({ message: "Token has been logged out" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "invalid or experice token" });
        }
        req.user = user;
        next();
    });
};

// show the profile after login token
// router.get('/profile', authenticateJWT, (req, res) => {
//     res.status(200).json({ message: "profile infoemation", user: req.user });
// });

router.get('/profile', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Profile information", user });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile', error: err.message });
    }
});


// logout api geting after login 
// router.post('/logout', (req, res) => {
//     res.status(200).json({ message: 'logout  sccessful' });
// });

const blacklistedTokens = [];
router.post('/logout', authenticateJWT, (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token)
    if (token) {
        blacklistedTokens.push(token);
    }
    res.status(200).json({ message: 'Logout successful' });
});



module.exports = router;