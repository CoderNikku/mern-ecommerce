const mongoose = require('mongoose')

const AdminBlogSchema = new mongoose.Schema({
    imagePath: { type: String },
    title:{type:String},
    info:{type:String},
    rate: { type: Number },
    watching: { type: Number },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "admin", required: true }
});

module.exports = mongoose.model('adminblog', AdminBlogSchema);
