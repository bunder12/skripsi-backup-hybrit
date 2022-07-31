function prepareRating(ratings) {
  const ratingsGroupedByUser = getRatingsGroupedByUser(ratings);
  const ratingsGroupedByAttraction = getRatingsGroupedByAttraction(ratings);

  return {
    ratingsGroupedByUser,
    ratingsGroupedByAttraction,
  };
}

function getRatingsGroupedByUser(ratings) {
  return ratings.reduce((result, value) => {
    
    //value mengambil nilai baris array keseluruhan contoh: { aid: 'A1', uid: 'U1', rating: 4 }
    const { aid, uid, rating } = value;

    //Jika nilai UID pertama sudah habis maka jalankan kondisi dalam if begitupun selanjutnya
    if (!result[uid]) {
      result[uid] = {};
    }

    //mengambil nilai rating
    result[uid][aid] = { rating };

    //mencetak nilai dari keseluruhan 
    return result;
  }, {});
}

function getRatingsGroupedByAttraction(ratings) {
  return ratings.reduce((result, value) => {
    const { aid, uid, rating } = value;

    if (!result[aid]) {
      result[aid] = {};
    }

    result[aid][uid] = { rating };

    return result;
  }, {});
}

module.exports = prepareRating;
