const thaiWordTokenied = require("../lib/thaiWordTokenized");

function prepareAttraction(attractions) {
  let attractionInList = tokenized(attractions, "wisata");

  const dictionaries = prepareDictionaries(attractionInList);

  const X = attractionInList.map(toFeaturizedAttractions(dictionaries));

  return {
    X,
  };
}

function tokenized(array, property) {
  return array.map((value) => ({
    ...value,
    [property]: thaiWordTokenied(value[property]),
  }));
}

function prepareDictionaries(attractions) {
  let nameDictionary = toDictionary(attractions, "wisata");
  let provinceDictionary = toDictionary(attractions, "kategori_id");
  // let typeDictionary = toDictionary(attractions, "type");

  nameDictionary = filterByThreshold(nameDictionary, 0);
  provinceDictionary = filterByThreshold(provinceDictionary, 0);
  // typeDictionary = filterByThreshold(typeDictionary, 0);

  return {
    nameDictionary,
    provinceDictionary,
    // typeDictionary,
  };
}

function toDictionary(array, property) {
  const dictionary = {};

  function insertToDictionary(value) {
    if (!dictionary[value]) {
      dictionary[value] = { name: value, count: 1 };
    } else {
      dictionary[value] = {
        ...dictionary[value],
        count: dictionary[value].count + 1,
      };
    }
  }

  array.forEach((object) => {
    if (Array.isArray(object[property])) {
      (object[property] || []).forEach((value) => {
        insertToDictionary(value);
      });
    } else {
      insertToDictionary(object[property]);
    }
  });

  return dictionary;
}

function filterByThreshold(dictionary, threshold) {
  return Object.keys(dictionary)
    .filter((key) => dictionary[key].count > threshold)
    .map((key) => ({ id: key, ...dictionary[key] }));
}

function toFeaturizedAttractions(dictionaries) {
  return function toFeatureVector(attraction) {
    const featureVector = [];

    featureVector.push(
      ...toFeaturizedFromDictionary(
        attraction,
        dictionaries.nameDictionary,
        "wisata"
      )
    );
    featureVector.push(
      ...toFeaturizedFromDictionary(
        attraction,
        dictionaries.provinceDictionary,
        "kategori_id"
      )
    );
    // featureVector.push(
    //   ...toFeaturizedFromDictionary(
    //     attraction,
    //     dictionaries.typeDictionary,
    //     "type"
    //   )
    // );

    return featureVector;
  };
}

function toFeaturizedFromDictionary(attraction, dictionary, property) {
  return dictionary.map((value) =>
    attraction[property].includes(value.id) ? 1 : 0
  );
}

module.exports = prepareAttraction;
