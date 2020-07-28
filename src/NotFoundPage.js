import React, { PureComponent } from "react";

export default class NotFoundError extends PureComponent {
	render() {
		window.mixpanel.track("Page view", {"page": "Page not found"});
    console.log(this.props.location.pathname);
    window.ga("send", "pageview", this.props.location.pathname);
		return (
			<div className="container-fluid">
				<div className="site-heading text-center pt-5">
					<h1>Page not found</h1>
				</div>
			</div>
		);
	}
}