var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var imageSchema = new Schema({
    path: {
        type: String,
        required: true,
        trim: true
    },
    originalname: {
        type: String,
        required: true
    }
});

var images = mongoose.model('images', imageSchema);

module.exports = images;