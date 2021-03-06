import React from "react";
import Typography from "@material-ui/core/Typography";
import _sortBy from "lodash/sortBy";
import _groupBy from "lodash/groupBy";
import _sum from "lodash/sum";

export const originMap = {"Asien": "asia", "Nordeuropa": "europe", "Sydeuropa": "europe", "Mellanöstern": "asia", "Nordamerika": "americas", "Sydamerika": "americas", "Afrika": "africa"};
export const pepperValues = ["Ingen hetta", "Lite hetta", "Lagom hetta", "Stark", "För stark", "Alldeles för stark"];

export function firstLetterUpperCase(str) {
	return str ? str[0].toUpperCase() + str.slice(1) : "";
}

export function getPepperIcons(heat) {
	const numPeppers = pepperValues.indexOf(heat);
	let peppers = [];
	for (let i = 0; i < numPeppers; i++) {
		peppers.push(<i key={i} className="fas fa-pepper-hot"/>);
	}
	return peppers;
}

function aggregateReviews(reviews) {
	const scores = ["tasteScore", "environmentScore", "extrasScore", "innovationScore", "price"];
	var agg = {};
	scores.forEach(score => {
		agg[score] = _sum(reviews.map(r => parseInt(r[score])));
	});
	return agg;
}

export function getAggregatedReviews(reviews) {
	const scoreSums = aggregateReviews(reviews);
	const tastePrecise = scoreSums.tasteScore/reviews.length;
	const tasteScore = Math.round(tastePrecise);
	const extrasAvg = scoreSums.extrasScore ? Math.round(scoreSums.extrasScore/reviews.length) : 0;
	const envAvg = Math.round(scoreSums.environmentScore/reviews.length);
	const innovationAvg = Math.round(scoreSums.innovationScore/reviews.length);
	const priceAvg = Math.round(scoreSums.price/reviews.length);

	const weightedExtrasAvg = extrasAvg / 5;
	const valueScore = ((tasteScore + (envAvg / 2) + weightedExtrasAvg || 0) / (priceAvg / 12));
	const bestTaste = tasteScore + weightedExtrasAvg >= 10;
	const mostInnovation = innovationAvg >= 8;

	return {
		numReviews: reviews.length,
		scoreSums: scoreSums,
		tastePrecise: tastePrecise,
		tasteScore: tasteScore,
		valueScore: valueScore,
		extrasAvg: extrasAvg,
		envAvg: envAvg,
		innovationAvg: innovationAvg,
		priceAvg: priceAvg,
		weightedExtrasAvg: weightedExtrasAvg,
		mostValue: valueScore > 1,
		bestTaste: bestTaste,
		mostInnovation: mostInnovation,
		description: mode(cleanGet(reviews, "description")),
		meal: mode(cleanGet(reviews, "meal"))
	};
}

export function filterReviews(groupedReviews, aggregatedReviews, filterOn) {
	var filteredReviews = {};
	Object.keys(groupedReviews).forEach(restaurant => {
		if (aggregatedReviews[restaurant][filterOn]) {
			filteredReviews[restaurant] = groupedReviews[restaurant];
		}
	})
	return filteredReviews;
}

export function sortReviews(reviews, aggregatedReviews, sortOn) {
	return _sortBy(
    _sortBy(reviews, review => review.restaurant), 
    review => aggregatedReviews[review.restaurant.toLowerCase()][sortOn])
  .reverse()
}

export function groupReviews(reviews) {
	return _groupBy(reviews, r => r.restaurant.toLowerCase());
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

export function getRateCircles(score, background="white") {
	var icons = [];
	for (let i = 0; i < 5; i++) {
		if (Math.floor(score/2) > i) {
			icons.push(<div key={i} className="circle"/>)
		} else if(score/2 - i === .5) {
			icons.push(<div key={i} className={`circle-half-${background}`}/>)
		} else {
			icons.push(<div key={i} className="circle-empty"/>)
		}
	}
	return <div className="row m-0">{icons}</div>;
}

export function toPointer(restaurant) {
	return restaurant.toLowerCase().replace(/[^a-zåäö0-9]+/g, "");
}

export function reviewToKey(review) {
	return review.reviewer + review.timestamp + review.meal;
}

export function mode(arr) {
	return arr.sort((a,b) =>
			arr.filter(v => v===a).length
		- arr.filter(v => v===b).length
	).pop();
}

export function cleanGet(reviews, key) {
	return reviews.map(review => review[key]).filter(Boolean);
}

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <div className="pb-2 tab-content">{children}</div>}
    </Typography>
  );
}
