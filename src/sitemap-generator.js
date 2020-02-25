const path = require("path");
const { createSitemapsAndIndex } = require("sitemap");
const _ = require("lodash");
const fetch = require("node-fetch");

const dest = path.resolve("./public", "sitemap");
const hostname = "https://www.sthlmlunch.se/sitemap";
const routes = ["/", "/restaurants"];

fetch("https://www.sthlmlunch.se/reviews.json")
.then((response) => {
  response.json()
  .then((reviews) => {
    Object.keys(_.groupBy(reviews, "restaurant")).forEach(restaurant => {
    	routes.push("/#/restaurant/" + restaurant);
    });
    createSitemapsAndIndex({
  	  hostname: hostname,
  	  targetFolder: dest,
  	  urls: routes,
      gzip: false
	   });
  });
});