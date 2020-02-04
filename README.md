## Lunch guide website

Reviews are gathered from selected critics via Google form and is parsed by a lambda that is behind an API Gateway. 
The parsed file is placed at:
http://lunch-static.s3-website.eu-north-1.amazonaws.com/reviews.json

local testing: `yarn start`
deploy build to s3: `yarn deploy`

Site served from:
http://lunch-static.s3-website.eu-north-1.amazonaws.com/#/