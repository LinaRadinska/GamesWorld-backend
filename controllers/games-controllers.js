const Game = require('../models/game');

const HttpError = require('../lib/http-error');
const ErrorCodes = require('../lib/enums/errorCodes');

const getGames = async (req, res, next) => {

    try {
        const games = await Game.find();
        res.json({ games: games.map(game => game.toObject({ getters: true })) });
    } catch (err) {
        const error = new HttpError("Something went wrong, could not find games.", ErrorCodes.INTERNAL_SERVER_ERROR);
        return next(error);
    }
}

const getUpcomingGames = async (req, res, next) => {
    try {
        const upcomingGames = await Game.find({ status: 'upcoming' });
        res.json({ games: upcomingGames.map(game => game.toObject({ getters: true })) });
    } catch (err) {
        const error = new HttpError("Something went wrong, could not find upcoming games.", ErrorCodes.INTERNAL_SERVER_ERROR);
        return next(error);
    }
}

const getGameById = async (req, res, next) => {
    const gameId = req.params.gameId;
    let game;
    try {
        game = await Game.findById(gameId);
    } catch (err) {
        const error = new HttpError("Something went wrong, could not find game.", ErrorCodes.INTERNAL_SERVER_ERROR);
        return next(error);
    }

    if(!game){
        const error = new HttpError("Something went wrong, could not find game by the provided id.", ErrorCodes.NOT_FOUND);
        return next(error);
    }

    res.json({game: game.toObject({ getters: true })});

}

const getGameWithReviews = async (req, res, next) => {
    const gameId = req.params.gameId;
    let gameWithReviews;
    
    try {
        gameWithReviews = await Game.findById(gameId).populate({path: 'reviews', populate:{ path: 'owner', select: 'username' }});
    } catch (err) {
        const error = new HttpError("Something went wrong, could not find game.", ErrorCodes.INTERNAL_SERVER_ERROR);
        return next(error);
    }

    if(!gameWithReviews || gameWithReviews.reviews == undefined) {
        return next(new HttpError("Could not find reviews for the provided game id.", ErrorCodes.NOT_FOUND));
    }


    res.json({ game: gameWithReviews.toObject({ getters: true}) });
}

exports.getGames = getGames;
exports.getUpcomingGames = getUpcomingGames;
exports.getGameById = getGameById;
exports.getGameWithReviews = getGameWithReviews;