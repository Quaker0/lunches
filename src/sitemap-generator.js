const path = require("path");
const fs = require("fs");
const { createSitemapsAndIndex } = require("sitemap");
const _ = require("lodash");
const fetch = require("node-fetch");

const dest = path.resolve("./public", "sitemap");
const hostname = "https://www.sthlmlunch.se";
const routes = ["/", "/restaurants"];

fetch("https://www.sthlmlunch.se/reviews.json")
.then((response) => {
  response.json()
  .then((reviews) => {
    Object.keys(_.groupBy(reviews, "restaurant")).forEach(restaurant => {
    	routes.push("/restaurants/" + restaurant);
    });
    createSitemapsAndIndex({
	  hostname: hostname,
	  sitemapName: "sm",
	  sitemapSize: 50,
	  targetFolder: dest,
	  urls: routes
	});
  }
  );
})