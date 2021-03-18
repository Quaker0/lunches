import React, { PureComponent } from "react";
import { Helmet } from "react-helmet";
import mixpanel from "mixpanel-browser";

mixpanel.init("d7a7c6b2479a03ab4163bd44a5c0b26d", {
    api_host: "https://api-eu.mixpanel.com",
})

export default class NotFoundError extends PureComponent {
  render() {
    mixpanel.track("Page view", {"page": "Page not found"});
    return (
      <>
        <Helmet>
          <title>STHLM LUNCH - Not found</title>
        </Helmet>
        <div className="container-fluid">
          <div className="site-heading text-center pt-5">
            <h1>Page not found</h1>
          </div>
        </div>
      </>
    );
  }
}