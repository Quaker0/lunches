import React from "react";
import { List } from "immutable";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import _ from "lodash";
import { createHashHistory } from "history"

export const history = createHashHistory()
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
		agg[score] = _.sumBy(reviews, r => parseInt(r[score]));
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
	return _(reviews).chain()
	.sortBy(review => review.restaurant)
	.sortBy(review => aggregatedReviews[review.restaurant.toLowerCase()][sortOn])
	.reverse()
	.value()
}

export function groupReviews(reviews) {
	return _.groupBy(reviews, r => r.restaurant.toLowerCase());
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
	return restaurant.toLowerCase().replace("[^a-zA-Zåäö]", "");
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
	return _.compact(List(reviews).map(review => review[key]).toArray());
}

export function TabMenu(props) {
  return (
    <>
      <AppBar position="static" color="inherit">
        <Tabs value={props.value} onChange={props.handleChange} indicatorColor="primary" variant="fullWidth">
          { List(props.tabs).map((tab) => <Tab icon={tab.icon} label={tab.title} key={tab.title.toLowerCase()}/>).toArray() }
        </Tabs>
      </AppBar>
      
      {
        List(props.tabs).map((tab, index) => (
          <TabPanel key={index} value={props.value} index={index}>
            { tab.page }
          </TabPanel>
        )).toArray()
      }
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box py={3}>{children}</Box>}
    </Typography>
  );
}
