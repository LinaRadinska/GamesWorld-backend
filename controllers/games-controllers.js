
const getGames = (req, res, next) => {
    res.json("Get All Games Is Working!");
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