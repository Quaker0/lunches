import _ from 'lodash';
import React from 'react';
import { List } from 'immutable';

export const originMap = {"Asien": "asia", "Nordeuropa": "europe", "Sydeuropa": "europe", "Mellanöstern": "asia", "Nordamerika": "americas", "Sydamerika": "americas", "Afrika": "africa"};
export const pepperValues = ["Ingen hetta", "Lite hetta", "Lagom hetta", "Stark", "För stark", "Alldeles för stark"];

export function getPepperIcons(heat) {
  const numPeppers = pepperValues.indexOf(heat);
  let peppers = [];
  for (let i = 0; i < numPeppers; i++) {
    peppers.push(<i key={i} className="fas fa-pepper-hot"/>);
  }
  return peppers;
}

function aggregateReviews(reviews) {
  const scores = ["taste_score", "environment_score", "extras_score", "innovation_score", "price"];
  var agg = {};
  scores.forEach(score => {
    agg[score] = _.sumBy(reviews, r => parseInt(r[score]));
  });
  return agg;
}

export function getAggregatedReviews(reviews) {
  const scoreSums = aggregateReviews(reviews);
  const tasteAvg = Math.round(scoreSums.taste_score/reviews.length);
  const extrasAvg = scoreSums.extras_score ? Math.round(scoreSums.extras_score/reviews.length) : 0;
  const envAvg = Math.round(scoreSums.environment_score/reviews.length);
  const innovationAvg = Math.round(scoreSums.innovation_score/reviews.length);
  const priceAvg = Math.round(scoreSums.price/reviews.length);

  const weightedExtrasAvg = extrasAvg / 5;
  const mostValue = ((tasteAvg + (envAvg / 2) + weightedExtrasAvg || 0) / (priceAvg / 12)) > 1;
  const bestTaste = tasteAvg + weightedExtrasAvg >= 10;
  const mostInnovation = innovationAvg >= 8;
  const bestDate = envAvg >= 7 && tasteAvg >= 6 && priceAvg > 120 && !reviews[0].origin.includes("Nordamerika");

  return {
    "scoreSums": scoreSums,
    "tasteAvg": tasteAvg,
    "extrasAvg": extrasAvg,
    "envAvg": envAvg,
    "innovationAvg": innovationAvg,
    "priceAvg": priceAvg,
    "weightedExtrasAvg": weightedExtrasAvg,
    "mostValue": mostValue,
    "bestTaste": bestTaste,
    "mostInnovation": mostInnovation,
    "bestDate": bestDate,
    "description": mode(cleanGet(reviews, "description")),
    "meal": mode(cleanGet(reviews, "meal"))
  }
}

export function filterReviews(reviews, aggregatedReviews, filterOn) {
  var filteredReviews = {};
  Object.keys(reviews).forEach(restaurant => {
    if (aggregatedReviews[restaurant][filterOn]) {
      filteredReviews[restaurant] = reviews[restaurant];
    }
  })
  return filteredReviews;
}

export function filterSearchedReviews(reviews, searchPhrase) {
  return Object.keys(reviews)
    .filter(restaurant => restaurant.toLowerCase().includes(searchPhrase.toLowerCase()))
    .reduce((obj, key) => {
      obj[key] = reviews[key];
      return obj;
    }, {});
}

export function parseDate(timestamp) {
  const date = new Date(timestamp.substring(0, 10));
  return date.toLocaleDateString();
}

export function getRateCircles(score) {
  var icons = [];
  for (let i = 0; i < 5; i++) {
    if (Math.floor(score/2) > i) {
      icons.push(<div key={i} className="circle"/>)
    } else if(score/2 - i === .5) {
      icons.push(<div key={i} className="circle-half"/>)
    } else {
      icons.push(<div key={i} className="circle-empty"/>)
    }
  }
  return (<div className="row m-0">{icons}</div>);
}

export function mode(arr) {
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}

export function cleanGet(reviews, key) {
  return _.compact(List(reviews).map(review => review[key]).toArray());
}
