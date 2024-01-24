const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    cover: { type: String, required: true },
    trailer: { type: String, required: true },
    discount: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true },
    genres: { type: [String], required: true },
    features: { type: [String], required: true },
    reviews: [{type: mongoose.Types.ObjectId, required: true, ref: 'Review'}]
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;