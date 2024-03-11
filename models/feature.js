const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const featureSchema = new Schema({
    name: { type: String, required: true }
});

const Feature = mongoose.model('Feature', featureSchema);

module.exports = Feature;