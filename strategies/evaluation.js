/**
 * Reference:
 * https://medium.com/moosend-engineering-data-science/building-a-validation-framework-for-recommender-systems-a-quest-ec173a24b56f
 * https://medium.com/c-g-datacommunity/mse-rmse-mae-เลือกใช้ยังไงดีมาลองดูที่ความหมาย-17b37b0b14b3
 */

/**
 * Mean Absolute Error
 * @param {Array} ratings
 * @returns 0-1, Lower is Better
 */
function mae(ratings) {
  const sumAbsoluteError = ratings.reduce((sum, value) => {
    const error = value.actualRating - value.predictRating;
    sum += Math.abs(error);
    return sum;
  }, 0);

  return sumAbsoluteError / ratings.length;
}

/**
 * Root Mean Square Error
 * @param {Array} ratings
 * @returns {Number} 0-1, Lower is Better
 */
function rmse(ratings) {
  const sumSquareError = ratings.reduce((sum, value) => {
    const error = value.actualRating - value.predictRating;
    sum += Math.pow(error, 2);
    return sum;
  }, 0);

  return Math.sqrt(sumSquareError / ratings.length);
}

function precisionAtK(ratingsGroupedByUser, attractions, userId) {
  const itemsIdByUser = Object.keys(ratingsGroupedByUser[userId]);
  return itemsIdByUser.length / attractions.length;
}

function recallAtK(ratingsGroupedByUser, userId) {
  const itemsIdByUser = Object.keys(ratingsGroupedByUser[userId]);
  const universalItemsByUser = [];

  for (const key1 in ratingsGroupedByUser) {
    if (Object.hasOwnProperty.call(ratingsGroupedByUser, key1)) {
      const ratingsByUser = ratingsGroupedByUser[key1];
      for (const key2 in ratingsByUser) {
        if (Object.hasOwnProperty.call(ratingsByUser, key2)) {
          if (!universalItemsByUser.includes(key2)) {
            universalItemsByUser.push(key2);
          }
        }
      }
    }
  }

  return itemsIdByUser.length / universalItemsByUser.length;
}

function f1Score(ratingsGroupedByUser, attractions, userId) {
  const precision = precisionAtK(ratingsGroupedByUser, attractions, userId);
  const recall = recallAtK(ratingsGroupedByUser, userId);

  return 2 * ((precision * recall) / (precision + recall));
}

module.exports = {
  mae,
  rmse,
  precisionAtK,
  recallAtK,
  f1Score,
};
