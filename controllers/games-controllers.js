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

const getUpcomingGames = async (req, res, next) => {
    try {
        const upcomingGames = await Game.find({ status: 'upcoming' });
        res.json({ games: upcomingGames.map(game => game.toObject({ getters: true })) });
    } catch (err) {
        const error = "Something went wrong, could not find upcoming games.";
        return next(error);
    }
}

const getGameById = async (req, res, next) => {
    const gameId = req.params.gameId;
    let game;
    try {
        game = await Game.findById(gameId);
    } catch (err) {
        const error = "Something went wrong, could not find game.";
        return next(error);
    }

    if(!game){
        const error = "Something went wrong, could not find game by the provided id.";
        return next(error);
    }

    res.json(game.toObject({ getters: true }));

}

const getGameWithReviews = (req, res, next) => {
    res.json("Get Reviews By GameId Is Working!");
}

exports.getGames = getGames;
exports.getUpcomingGames = getUpcomingGames;
exports.getGameById = getGameById;
exports.getGameWithReviews = getGameWithReviews;