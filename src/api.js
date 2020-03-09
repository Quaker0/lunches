import { getIdToken } from "./login.js"

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

export async function addReview(data) {
  return await fetch("https://gykcy8at42.execute-api.eu-north-1.amazonaws.com/Prod/add-review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getIdToken()
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data)
  });
}