const mongoose = require('mongoose');

const userproductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imagePath: { type: String },
    price: { type: Number, required: [true, 'Price is required'],min:[0,'Price must be a valid number']
        ,validate:{
            validator:Number.isFinite, message:'Price must be a valid number'
        }
    } // Ensure this matches your code
},
{
    timestamps:true
}
);

module.exports = mongoose.model('Userproduct', userproductSchema); 