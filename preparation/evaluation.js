const mapNumberRange = require("../functions/mapNumberRange");

function prepareEvaluationRatings(predicteds, ratingsGroupedByUser, userId) {
  return predicteds
    .map((predicted) => {
      const attractionId = predicted.attractionId;
      const ratingByUser =
        ratingsGroupedByUser[userId][attractionId]?.rating ?? 0;
      const actualRating = mapNumberRange(ratingByUser, 0, 5, 0, 1);
      const predictRating = predicted.score;

      return { attractionId, actualRating, predictRating };
    })
    .filter((v) => Boolean(v.actualRating));
}

module.exports = {
  prepareEvaluationRatings,
};
