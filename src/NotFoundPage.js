import React, { PureComponent } from "react";
import { ga } from "./utils.js"

export default class NotFoundError extends PureComponent {
	render() {
		window.mixpanel.track("Page view", {"page": "Page not found"});
    ga.pageview(this.props.location.pathname);
		return (
			<div className="container-fluid">
				<div className="site-heading text-center pt-5">
					<h1>Page not found</h1>
				</div>
			</div>
		);
	}
}