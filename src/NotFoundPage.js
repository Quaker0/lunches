import React, { PureComponent } from 'react';

export default class NotFoundError extends PureComponent {
	render() {
		return (
			<div className="container-fluid">
				<div className="site-heading text-center pt-5">
					<h1>Page not found</h1>
				</div>
			</div>
		);
	}
}