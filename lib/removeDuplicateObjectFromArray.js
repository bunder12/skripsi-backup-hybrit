function removeDuplicateObjectFromArray(array, key) {
  return array.reduce((result, value) => {
    if (!result.find((v) => v[key] === value[key])) {
      result.push(value);
      return result;
    }

    return result;
  }, []);
}

module.exports = removeDuplicateObjectFromArray;
