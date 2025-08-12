// blogSchema.js
const mongoose = require('mongoose')

const userblogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

// Export the model
module.exports = mongoose.model('Userblog', userblogSchema);