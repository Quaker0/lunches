## [Lunch guide website](https://sthlmlunch.se)

Reviews are gathered from selected critics (read a couple friends) behind a login served by cognito and is parsed by lambdas behind API Gateway and SES (for emailing pictures).

local testing: `yarn start`
deploy build to s3: `yarn deploy`