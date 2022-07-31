const removeDuplicateObjectFromArray = require("../lib/removeDuplicateObjectFromArray");
const {
  getCosineSimilarityRowVector,
  getAttractionIndexById,
  sortByScore,
  filterByScore,
  sortByRating,
} = require("./common");

function predictWithContentBased(X, attractions, ratingsGroupedByUser, userId) {
  const ratingGroupedByUser = ratingsGroupedByUser[userId];

  const attractionsRatingByUser = sortByRating(
    mapObjectToArray(ratingGroupedByUser)
  );

  const predictedDublicateContentBased = predictAttractionsRatingByUser(
    X,
    attractions,
    attractionsRatingByUser
  );

  const predictedContentBased = removeDuplicateObjectFromArray(
    predictedDublicateContentBased,
    "attractionId"
  );

  return sortByScore(predictedContentBased);
}

function mapObjectToArray(object) {
  const array = [];

  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      const element = object[key];
      array.push({ id: key, ...element });
    }
  }

  return array;
}

function predictAttractionsRatingByUser(
  X,
  attractions,
  attractionsRatingByUser
) {
  const predictAttractionsRatingByUser = attractionsRatingByUser.reduce(
    (result, attraction) => {
      const attractionId = attraction.id;
      const a = predictAttractionWithContentBased(X, attractions, attractionId);

      result.push(...a);

      return result;
    },
    []
  );

  return sortByScore(predictAttractionsRatingByUser);
}

function predictAttractionWithContentBased(X, attractions, attractionId) {
  //attractionId menyimpan 3 id yang mendekati similarity(tertinggi)
  const movieIndex = getAttractionIndexById(attractions, attractionId);
  const cosineSimilarityRowVector = getCosineSimilarityRowVector(X, movieIndex);

  const predictedAttractions = cosineSimilarityRowVector.map(
    (value, index) => ({
      attractionId: attractions[index]._id,
      score: value,
    })
  );

  return sortByScore(filterByScore(predictedAttractions, 0));
}

module.exports = predictWithContentBased;
