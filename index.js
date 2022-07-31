// const attractions = require("./data/attractions");
// const ratings = require("./data/attractionsHasRating");
const prepareAttraction = require("./preparation/attraction");
const prepareRating = require("./preparation/rating");
const {
  predictWithCFUserBased,
  predictWithCFItemBased,
} = require("./strategies/collaborativeFiltering");
const predictWithContentBased = require("./strategies/contentBased");
const predictWithHybrid = require("./strategies/hybrid");
const { prepareEvaluationRatings } = require("./preparation/evaluation");
const { mae, rmse, f1Score } = require("./strategies/evaluation");
const axios = require('axios')

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

axios.get(`http://localhost:5000/getWisata`)
.then(function (res) {
  const attractions = res.data.data;

axios.get(`http://localhost:5000/rating`)
.then(function (response) {
  let ratings = response.data;

mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
  .then(res => {
      console.log('database terhubung')
  })
  .catch(err => {
      console.log(err)
  })
  
  
  
  //Hasil dapat berubah jika USER_ID berbeda nilai
  const USER_ID = "6288f389d1c3ad1d4e0220b8";
  
  /* ------------- */
  //  Preparation  //
  /* ------------- */
  
  console.log("[Preparing Data] \n");
  
  const { X } = prepareAttraction(attractions); // For Content-Based
  const { ratingsGroupedByUser, ratingsGroupedByAttraction } =
  prepareRating(ratings); // For Content-Based and Collaborative
  
  console.log('rating user:', ratingsGroupedByUser);
  console.log('rating Attraction:', ratingsGroupedByAttraction);
  
  /* -------------------------- */
  //  Content-Based Prediction  //
  /* -------------------------- */
  
  
  //Hasil dapat berubah jika USER_ID berbeda nilai
  console.log('\n')
  console.log(`Content-Based >>> by user id ${USER_ID}`);
  
  const recommendedContentBased = predictWithContentBased(
    X,
    attractions,
    ratingsGroupedByUser,
    USER_ID
    );
    
    console.log(recommendedContentBased);
    console.log("\n");
    
    /* ------------------------------------ */
    //  Collaborative Filtering Prediction  //
    //            (User-Based)              //
    /* ------------------------------------ */
    
    console.log(`Collaborative Filtering (User-Based) >>> by user id ${USER_ID}`);
    
    const recommendedCFUserBased = predictWithCFUserBased(
      ratingsGroupedByUser,
    ratingsGroupedByAttraction,
    USER_ID
  );
  
  console.log(recommendedCFUserBased);
  console.log("\n");
  
  /* ------------------------------------ */
  //  Collaborative Filtering Prediction  //
  //            (Item-Based)              //
  /* ------------------------------------ */
  
  console.log(`Collaborative Filtering (Item-Based) >>> by user id ${USER_ID}`);
  
  const recommendedCFItemBased = predictWithCFItemBased(
    ratingsGroupedByUser,
    ratingsGroupedByAttraction,
    USER_ID
    );
    
    console.log(recommendedCFItemBased);
    console.log("\n");
    
    /* ------------------- */
    //  Hybrid Prediction  //
    /* ------------------- */
    
    console.log("Hybrid");
  
    const recommendedHybridApproaches = predictWithHybrid(
      recommendedContentBased,
      recommendedCFUserBased,
      recommendedCFItemBased
      );
      
      console.log(recommendedHybridApproaches);
      console.log("\n");
      
      /* ------------ */
      //  Evaluation  //
      /* ------------ */
      
  console.log("[Preparing Evaluation Ratings]\n");
  
  const evaluationRatings = prepareEvaluationRatings(
    recommendedHybridApproaches,
    ratingsGroupedByUser,
    USER_ID
    );
    
    const maeScore = mae(evaluationRatings);
    console.log("MAE:", maeScore);
    
    const rmseScore = rmse(evaluationRatings);
    console.log("RMSE:", rmseScore);
    
    const f1ScoreScore = f1Score(ratingsGroupedByUser, attractions, USER_ID);
    console.log("F1 Score:", f1ScoreScore);
    
    app.use(cors())
    app.use(bodyParser.json());
    app.use('/', (req, res) => {
      res.send(recommendedCFItemBased)
    });
    app.use('/mae', (req, res) => {
      res.send(maeScore)
    });
    
    app.listen(process.env.PORT, (req, res) => {
      console.log(`server run port ${process.env.PORT}`)
    })

})
.catch(function (error) {
  console.log(error);
});

})
.catch(function (error) {
  console.log(error);
});