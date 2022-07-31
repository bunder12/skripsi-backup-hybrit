function mapNumberRange(x, fromMin, fromMax, toMin, toMax) {
  return ((x - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;
}

module.exports = mapNumberRange;
