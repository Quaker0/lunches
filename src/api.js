import { getIdToken } from "./login.js"
import xmlParser from "fast-xml-parser";

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

export async function addRestaurant(data) {
  return await fetch("https://femvl1i8al.execute-api.eu-north-1.amazonaws.com/prod/add-restaurant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getIdToken()
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data)
  }).then(response => {
    if (response.status !== 200) {
      return {error: response.text(), status: response.status};
    }
    return {status: response.status, success: true};
  }).catch(e => {console.error(e)});
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

export function getPlaces(query) {
  if (!query) throw Error("Missing parameter sent");
  return fetch(`https://femvl1i8al.execute-api.eu-north-1.amazonaws.com/prod/get-places?query=${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getIdToken()
    },
    referrerPolicy: "no-referrer"
  }).then(response => {
    if (response.status !== 200) {
      response.json().then(data => console.error(data));
      return null;
    }
    return response.json()
  }).catch(e => {console.error(e)});
}

export function getPlaceDetails(params) {
  const url = "https://femvl1i8al.execute-api.eu-north-1.amazonaws.com/prod/get-place-details?" + new URLSearchParams(params)
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getIdToken()
    },
    referrerPolicy: "no-referrer"
  }).then(response => {
    if (response.status !== 200) {
      response.json().then(data => console.error(data));
      return null;
    }
    return response.json()
  }).catch(e => {console.error(e)});
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

export function getRestaurantMeta(options) {
  return fetch("https://www.sthlmlunch.se/restaurants/meta.json", { ...options })
  .then((response) => response.json())
  .catch(e => {
    if (e.name !== "AbortError") console.error(e);
  });
}

export function getRecentReviews(options) {
  return fetch("https://www.sthlmlunch.se/recentReviews.json", { ...options })
  .then((response) => response.json())
  .catch(e => {
    if (e.name !== "AbortError") console.error(e);
  });
}

export function getUnmatchedImages(options) {
  return fetch("https://sthlmlunch-pics.s3.amazonaws.com", options)
  .then(response => response.text())
  .then(body => {
    return xmlParser.parse(body).ListBucketResult.Contents.map(content => {
      if (content.Key.startsWith("processed/unmatched")) {
        return content.Key.replace("processed/", "");
      }
      return null;
    }).filter(Boolean)
  })
  .catch(e => {
    if (e.name !== "AbortError") console.error(e);
  });
}

export function getAllImages(options) {
  return fetch("https://sthlmlunch-pics.s3.amazonaws.com", options)
  .then(response => response.text())
  .then(body => {
    return xmlParser.parse(body).ListBucketResult.Contents.map(content => {
      if (content.Key.startsWith("processed/")) {
        return content.Key.replace("processed/", "");
      }
      return null;
    }).filter(Boolean)
  })
  .catch(e => {
    if (e.name !== "AbortError") console.error(e);
  });
}
