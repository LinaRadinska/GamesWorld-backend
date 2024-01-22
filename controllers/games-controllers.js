const Game = require('../models/game');

const getGames = async (req, res, next) => {
    try {
        const games = await Game.find();
        res.json({ games: games.map(game => game.toObject({ getters: true })) });
    } catch (err) {
        const error = "Something went wrong, could not find games.";

        return next(error);
    }
}

const getUpcomingGames = (req, res, next) => {
    res.json("Get Upcoming Games Is Working!");
}

const getGame = (req, res, next) => {
    res.json("Get Game By Id Is Working!");
}

const getGameReviews = (req, res, next) => {
    res.json("Get Reviews By GameId Is Working!");
}

exports.getGames = getGames;
exports.getUpcomingGames = getUpcomingGames;
exports.getGame = getGame;
exports.getGameReviews = getGameReviews;