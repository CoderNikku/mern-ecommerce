
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

module.exports = connectDB;




// local db connection
// const mongoUrl="mongodb://localhost:27017/test"
// const connectBD=async()=>{
//   try{
//     await mongoose.connect(mongoUrl);
//     console.log("locally coonnect succesfully")
//   }
//   catch(err){
//     console.log('error local connection mongodb',err)
//   }
// };

// module.exports=connectBD;