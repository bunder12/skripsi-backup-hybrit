const { getCosineSimilarityRowVector, sortByScore } = require("./common");
// const math = require("mathjs");

/* -------------------------------------- */
//  Predict with Collaborative Filtering  //
//              (User-Based)              //
/* -------------------------------------- */
function predictWithCFUserBased(
  ratingsGroupedByUser,
  ratingsGroupedByAttraction,
  userId
) {
  const { userItem } = getMatrices(
    ratingsGroupedByUser,
    ratingsGroupedByAttraction,
    userId
  );

  const { matrix, attractionIds, userIndex } = userItem;

  const userRatingsRowVector = matrix[userIndex];

  const cosineSimilarityRowVector = getCosineSimilarityRowVector(
    matrix,
    userIndex
  ); // .filter((value) => value > 0.5) // Can add filter for reduce scope

  const predictedRatings = userRatingsRowVector.map(
    (rating, attractionIndex) => {
      const attractionId = attractionIds[attractionIndex];

      const attractionRatingRowVector = getAttractionRatingRowVector(
        matrix,
        attractionIndex
      );

      let score;
      if (rating === 0) {
        score = getPredictedRating(
          cosineSimilarityRowVector,
          attractionRatingRowVector
        );
      }

      return { attractionId, score };
    }
  );

  const onlyNewAttraction = getOnlyNewAttraction(predictedRatings);

  return sortByScore(onlyNewAttraction);
}

/* -------------------------------------- */
//  Predict with Collaborative Filtering  //
//              (Item-Based)              //
/* -------------------------------------- */
function predictWithCFItemBased(
  ratingsGroupedByUser,
  ratingsGroupedByAttraction,
  userId
) {
  const { userItem } = getMatrices(
    ratingsGroupedByUser,
    ratingsGroupedByAttraction,
    userId
  );

  const { matrix, attractionIds, userIndex } = userItem;

  const userRatingsRowVector = getUserRatingsRowVector(matrix, userIndex);

  const predictedRatings = userRatingsRowVector.map(
    (rating, attractionIndex) => {
      const attractionId = attractionIds[attractionIndex];

      const cosineSimilarityRowVector = getCosineSimilarityRowVector(
        matrix,
        attractionIndex
      );

      let score;
      if (rating === 0) {
        score = getPredictedRating(
          cosineSimilarityRowVector,
          userRatingsRowVector
        );
      }

      return { attractionId, score };
    }
  );

  const onlyNewAttraction = getOnlyNewAttraction(predictedRatings);

  return sortByScore(onlyNewAttraction);
}

function getMatrices(ratingsGroupedByUser, ratingsGroupedByAttraction, uid) {
  const userItem = Object.keys(ratingsGroupedByUser).reduce(
    (result, userId, userIndex) => {
      const rowVector = Object.keys(ratingsGroupedByAttraction).map(
        (attractionId) => {
          return getConditionalRating(
            ratingsGroupedByUser,
            userId,
            attractionId
          );
        }
      );

      result.matrix.push(rowVector);

      if (userId === uid) {
        result.userIndex = userIndex;
      }

      return result;
    },
    {
      matrix: [],
      attractionIds: Object.keys(ratingsGroupedByAttraction),
      userIndex: null,
    }
  );

  return {
    userItem,
  };
}

/**
 * Two function below that use for make Centered Cosine Similarity
 */

// function meanNormalizeByRowVector(matrix) {
//   return matrix.map((rowVector) => {
//     return rowVector.map((cell) => {
//       return cell !== 0 ? cell - getMean(rowVector) : cell;
//     });
//   });
// }

// function getMean(rowVector) {
//   const valuesWithoutZeroes = rowVector.filter((cell) => cell !== 0);
//   return valuesWithoutZeroes.length ? math.mean(valuesWithoutZeroes) : 0;
// }

function getConditionalRating(value, primaryKey, secondaryKey) {
  if (!value[primaryKey]) {
    return 0;
  }

  if (!value[primaryKey][secondaryKey]) {
    return 0;
  }

  return value[primaryKey][secondaryKey].rating;
}

function getAttractionRatingRowVector(userBasedMatrix, attractionIndex) {
  return userBasedMatrix.map((userRatings) => {
    return userRatings[attractionIndex];
  });
}

function getUserRatingsRowVector(itemBasedMatrix, userIndex) {
  return itemBasedMatrix.map((itemRatings) => {
    return itemRatings[userIndex];
  });
}

function getPredictedRating(cosineSimilarityRowVector, ratingsVector) {
  const neighborSelection = cosineSimilarityRowVector
    .map((similarity, userIndex) => ({
      similarity,
      rating: ratingsVector[userIndex],
    }))
    .filter((value) => value.rating !== 0);

  const numerator = neighborSelection.reduce((result, value) => {
    return result + value.similarity * value.rating;
  }, 0);

  const denominator = neighborSelection.reduce((result, value) => {
    return result + value.similarity;
  }, 0);

  const rating = numerator / denominator; // 0-5

  return rating / 5; // 0-1
}

function getOnlyNewAttraction(predictedRatings) {
  return predictedRatings.filter((value) => value.score);
}

module.exports = {
  predictWithCFUserBased,
  predictWithCFItemBased,
};
