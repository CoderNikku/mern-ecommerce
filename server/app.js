const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const path = require("path");
const connectDB = require('./db'); // Ensure you have your DB connection setup
require('dotenv').config();
const bodyParser = require('body-parser');
const UserRouter=require('./routers/userRoute/userRouter');
const UserblogRouter=require('./routers/userRoute/userblogRouter')
const UserprodctRouter = require("./routers/userRoute/userproductRouter")
const AddminRouter=require('./routers/addminRoute/adminRouter')
const AddminblogRouter=require('./routers/addminRoute/adminblogRouter')
const AddminproductRouter =require('./routers/addminRoute/adminproductRouter')


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('uploads'))


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('images'))



// connect extrenal db
connectDB();

// external router configration
app.use('/user',UserRouter);
app.use('/userblog',UserblogRouter);
app.use('/userproduct',UserprodctRouter);


// addmin routing 
app.use('/admin',AddminRouter);
app.use('/adminblog',AddminblogRouter); 
app.use('/adminproduct',AddminproductRouter)


// app.use('/images', express.static(path.join(__dirname, 'uploads', 'images')));
// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); 
});




