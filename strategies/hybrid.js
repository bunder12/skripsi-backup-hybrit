const { sortByScore } = require("./common");

function predictWithHybrid(
  predictWithContentBased,
  predictWithCFUserBased,
  predictWithCFItemBased
) {
  const attractionIds = getAttractionIds(
    predictWithContentBased,
    predictWithCFUserBased,
    predictWithCFItemBased
  );

  const predictScores = attractionIds.map((attractionId) => {
    const { contentBasedScore, cfUserBasedScore, cfItemBasedScore } =
      getPredictedScoresById(
        predictWithContentBased,
        predictWithCFUserBased,
        predictWithCFItemBased,
        attractionId
      );

    const score = getPredictedScoreCalculated(
      contentBasedScore,
      cfUserBasedScore,
      cfItemBasedScore
    );

    return { attractionId, score };
  });

  return sortByScore(predictScores);
}

function getAttractionIdThatNotInArray(predicted, attractionIds) {
  const array = [];

  predicted.forEach((value) => {
    if (!attractionIds.includes(value.attractionId)) {
      array.push(value.attractionId);
    }
  });

  return array;
}

function getAttractionIds(
  predictWithContentBased,
  predictWithCFUserBased,
  predictWithCFItemBased
) {
  const attractionIds = [];

  attractionIds.push(
    ...getAttractionIdThatNotInArray(predictWithContentBased, attractionIds)
  );
  attractionIds.push(
    ...getAttractionIdThatNotInArray(predictWithCFUserBased, attractionIds)
  );
  attractionIds.push(
    ...getAttractionIdThatNotInArray(predictWithCFItemBased, attractionIds)
  );

  return attractionIds;
}

function findPredictedById(predicteds, attractionId) {
  return predicteds.find((value) => value.attractionId === attractionId) ?? 0;
}

function getPredictedScoresById(
  predictWithContentBased,
  predictWithCFUserBased,
  predictWithCFItemBased,
  attractionId
) {
  const { score: contentBasedScore } = findPredictedById(
    predictWithContentBased,
    attractionId
  );

  const { score: cfUserBasedScore } = findPredictedById(
    predictWithCFUserBased,
    attractionId
  );

  const { score: cfItemBasedScore } = findPredictedById(
    predictWithCFItemBased,
    attractionId
  );

  return {
    contentBasedScore,
    cfUserBasedScore,
    cfItemBasedScore,
  };
}

function getPredictedScoreCalculated(
  contentBasedScore,
  cfUserBasedScore,
  cfItemBasedScore
) {
  const weight = {
    contentBased: 0.3,
    cfUserBased: 0.4,
    cfItemBased: 0.3,
  };

  let numerator = 0;
  let denominator = 0;

  if (contentBasedScore) {
    numerator += weight.contentBased * contentBasedScore;
    denominator += weight.contentBased;
  }

  if (cfUserBasedScore) {
    numerator += weight.cfUserBased * cfUserBasedScore;
    denominator += weight.cfUserBased;
  }

  if (cfItemBasedScore) {
    numerator += weight.cfItemBased * cfItemBasedScore;
    denominator += weight.cfItemBased;
  }

  return numerator / denominator;
}

module.exports = predictWithHybrid;
