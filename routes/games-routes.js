const express = require("express");

const router = express.Router();

const gamesControllers = require('./../controllers/games-controllers');

router.get('/', gamesControllers.getGames);

router.get('/upcoming', gamesControllers.getUpcomingGames);

router.get('/:gid', gamesControllers.getGame);

router.get('/:gid/reviews', gamesControllers.getGameReviews);

module.exports = router;
