const mongoose = require('mongoose');
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

    if (!game) {
        const error = new HttpError("Something went wrong, could not find game by the provided id.", ErrorCodes.NOT_FOUND);
        return next(error);
    }

    res.json({ game: game.toObject({ getters: true }) });

}

const getGameWithReviews = async (req, res, next) => {
    const gameId = req.params.gameId;
    let gameWithReviews;

    try {
        gameWithReviews = await Game.findById(gameId).populate({ path: 'reviews', populate: { path: 'owner', select: 'username' } });
    } catch (err) {
        const error = new HttpError("Something went wrong, could not find game.", ErrorCodes.INTERNAL_SERVER_ERROR);
        return next(error);
    }

    if (!gameWithReviews || gameWithReviews.reviews == undefined) {
        return next(new HttpError("Could not find reviews for the provided game id.", ErrorCodes.NOT_FOUND));
    }


    res.json({ game: gameWithReviews.toObject({ getters: true }) });
}

const searchGames = async (req, res, next) => {
    const pageSize = parseInt(req.query.pageSize) || 6;
    const pageNumber = req.query.pageNumber || 1;
    const offset = (pageNumber - 1) * pageSize;
    const discount = req.query.discount;
    const sortBy = req.query.sortBy;

    try {
        let facetPipeline = [];

        const filters = [];

        if (req.query.title) {
            filters.push({ title: { $regex: new RegExp(req.query.title, 'i') } })
        }

        if (JSON.parse(discount)) {
            filters.push({ $expr: { $ne: ["$price", "$discountedPrice"] } });
        }

        if (req.query.facets) {
            const facets = req.query.facets;

            let tempFacets = {};

            facets.split("|").forEach(function (pair) {
                var keyValue = pair.split(":");
                var facetName = keyValue[0];
                var facetValue = keyValue[1];
                tempFacets[facetName] = facetValue.split(",");
            });

            for (const [key, value] of Object.entries(tempFacets)) {
                const newValue = value.map((v) => new mongoose.Types.ObjectId(v));
                const matchExpression = { [key]: { $in: newValue } };
                filters.push(matchExpression);
            }

        }

        if (filters.length > 0) {
            for (let value of filters) {
                facetPipeline.push({
                    $match: value
                });
            }
        }

        facetPipeline.push(
            {
                $facet: {
                    features: [
                        {
                            $unwind: "$features"
                        },
                        {
                            $group: {
                                _id: '$features',
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $lookup: {
                                from: 'features',
                                localField: '_id',
                                foreignField: '_id',
                                as: 'featureData'
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                id: '$_id',
                                name: { $arrayElemAt: ['$featureData.name', 0] },
                                count: 1
                            }
                        }
                    ],
                    genres: [
                        {
                            $unwind: "$genres"
                        },
                        {
                            $group: {
                                _id: '$genres',
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $lookup: {
                                from: 'genres',
                                localField: '_id',
                                foreignField: '_id',
                                as: 'genreData'
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                id: '$_id',
                                name: { $arrayElemAt: ['$genreData.name', 0] },
                                count: 1
                            }
                        }
                    ]
                }
            }
        );

        const facets = await Game.aggregate(facetPipeline);
        let searchQuery = Game.find().populate([{ path: 'features', select: 'name' }, { path: 'genres', select: 'name' }]);

        if (filters.length > 0) {
            for (let value of filters) {
                searchQuery = searchQuery.where(value);
            }
        }

        if (sortBy) {
            const sortBySplit = sortBy.split(' ');

            if (sortBySplit[1] === 'desc') {
                searchQuery = searchQuery.sort(`-${sortBySplit[0]}`);
            } else {
                searchQuery = searchQuery.sort(sortBySplit[0]);
            }
        }

        const searchResults = await searchQuery.skip(offset).limit(pageSize);

        res.json({
            facets,
            results: searchResults.map(result => result.toObject({ getters: true })),
            pageSize,
            offset
        });

    } catch (err) {
        console.log(err);
        const error = new HttpError("Something went wrong, could not find games.", ErrorCodes.INTERNAL_SERVER_ERROR);
        return next(error);
    }
}

exports.getGames = getGames;
exports.getUpcomingGames = getUpcomingGames;
exports.getGameById = getGameById;
exports.getGameWithReviews = getGameWithReviews;
exports.searchGames = searchGames;