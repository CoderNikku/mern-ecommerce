const mongoose =require('mongoose')


const AdminProductSchema=new mongoose.Schema({
    productImage:{type:String},
    name:{type:String},
    description:{type:String},
    price:{type:Number},
    author: {type:mongoose.Schema.Types.ObjectId, ref:"admin", require:true}
})

module.exports=mongoose.model('adminproduct',AdminProductSchema);