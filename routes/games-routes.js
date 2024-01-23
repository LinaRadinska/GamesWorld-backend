const express = require("express");

const router = express.Router();

const gamesControllers = require('./../controllers/games-controllers');

router.get('/', gamesControllers.getGames);

router.get('/upcoming', gamesControllers.getUpcomingGames);

router.get('/:gameId', gamesControllers.getGameById);

router.get('/:gameId/reviews', gamesControllers.getGameWithReviews);

module.exports = router;
