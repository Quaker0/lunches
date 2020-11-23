import React, { PureComponent } from "react";
import { Helmet } from "react-helmet";

export default class NotFoundError extends PureComponent {
  render() {
    window.mixpanel.track("Page view", {"page": "Page not found"});
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