const similarity = require("compute-cosine-similarity");

function getAttractionIndexById(attractions, id) {
  //attraction menyimpan semua data pada data/attraction.js
  //variable id menyimpan id 3 tertinggi
  return attractions.map((attraction) => attraction._id).indexOf(id);
}

function getCosineSimilarityRowVector(matrix, index) {
  return matrix.map((rowRelative, i) => {
    return similarity(matrix[index], matrix[i]);
  });
}

function sortByScore(array) {
  return array.sort((a, b) => b.score - a.score);
}

function sortByRating(array) {
  return array.sort((a, b) => b.rating - a.rating);
}

function filterByScore(predicteds, morethan) {
  return predicteds.filter((value) => value.score > morethan);
}

function predictedToAttractionList(predicteds, attractionList) {
  return predicteds.map(({ attractionId, score }) => {
    const attraction = attractionList.find(
      (value) => value._id === attractionId
    );

    return { ...attraction, score };
  });
}

module.exports = {
  getAttractionIndexById,
  getCosineSimilarityRowVector,
  sortByScore,
  sortByRating,
  filterByScore,
  predictedToAttractionList,
};
