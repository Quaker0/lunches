export function getRestaurantMeta() {
  return fetch("https://www.sthlmlunch.se/restaurants/meta.json")
  	.then((response) => response.json());
}

export function getRestaurantReviews(reviewPointer) {
	if (!reviewPointer) {
		throw Error("Missing reviewPointer!")
	}
	return fetch(`https://www.sthlmlunch.se/restaurants/${reviewPointer}`)
	.then((response) => response.json());
}