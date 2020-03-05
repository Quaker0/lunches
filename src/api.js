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
  const response = await fetch("https://gykcy8at42.execute-api.eu-north-1.amazonaws.com/Prod/add-review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "eyJraWQiOiJTb2UwN0NwRVNBWEppZE1qVHVEZFwvbk9sU3k4ekZyUnJaVGxuVXFGd1wvdEU9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIyYzRmNzg1ZC00N2MxLTQzMTctYjQ2Zi0zOGZjYjYyM2YzZDciLCJldmVudF9pZCI6ImE5MGNjMTg2LTkzYjMtNDBiYy04ZmZiLWJiNTQyOTI0YzNlNyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1ODM0MzkxMDQsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS1jZW50cmFsLTEuYW1hem9uYXdzLmNvbVwvZXUtY2VudHJhbC0xXzg0NWhxRWxTdCIsImV4cCI6MTU4MzQ0MjcwNCwiaWF0IjoxNTgzNDM5MTA0LCJqdGkiOiJlNDYxZjYzOC1iZDg3LTQ4NjgtOWQ3YS1jODc5OGE4ODdlOGUiLCJjbGllbnRfaWQiOiIxMGNrbDg0anB2bThzamlkZDFrbm1jcWwxciIsInVzZXJuYW1lIjoibmljbGFzIn0.XOLvYiG3jv7GzpN15qNmWRGG3ppF4Szh_H9gatpCOoYBcFTGpq8OTEmZp3Mjp0PQnJ3BVcilv1UZov9RlW5hVrV09RlhJNtR6bOCbEEJ6SbVYPjr9rXCdZvY0bo5xpabHVedd28Lwpx9JHGvfViCBzGUAKWm-BjfgSKdAFVWJeu7NPtBYq2yCbu-Hy9MIwcFRz2WELVeBOEFphd7cMIeSJpBWvmtZnTlaly0O2jD-NOnkxrWcwCysb3Iw6Fxxv2DqyBCFAsXVzwyUnOz9-FdI-nS4EGvwaIfrIuva9o1rDDYCl1l7Ws7kACFmfe18pHv-4u4q431ySumZgJU7WG1qw"
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data)
  });
  return await response.json();
}