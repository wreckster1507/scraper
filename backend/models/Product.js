const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    phoneName: String,
    price: Number,
    image: String,
    details: String,
    deliveryDate: String,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
