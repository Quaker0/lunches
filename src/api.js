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
  return await fetch("https://femvl1i8al.execute-api.eu-north-1.amazonaws.com/prod/add-review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getIdToken()
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data)
  });
}

export async function editReview(data) {
  return await fetch("https://femvl1i8al.execute-api.eu-north-1.amazonaws.com/prod/edit-review", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getIdToken()
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data)
  });
}

export async function editRestaurant(data) {
  return await fetch("https://femvl1i8al.execute-api.eu-north-1.amazonaws.com/prod/edit-restaurant", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getIdToken()
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data)
  });
}

export async function deleteReview(data) {
  return await fetch("https://femvl1i8al.execute-api.eu-north-1.amazonaws.com/prod/delete-review", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getIdToken()
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data)
  });
}