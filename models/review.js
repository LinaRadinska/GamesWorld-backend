const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
	owner: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
	game: { type: mongoose.Types.ObjectId, required: true, ref: 'Game' },
	description: String,
	rating: { type: Number, required: true }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;