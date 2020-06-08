import React, { Component } from "react";
import NotFoundPage from "./NotFoundPage";
import AdminPage from "./admin/AdminPage";
import RestaurantPage from "./RestaurantPage";
import Head from "./Head";
import ReviewPage from "./ReviewPage";
import { HashRouter, Route, Switch } from "react-router-dom";

export default class App extends Component {
	render() {
		return (
			<HashRouter>
				<>
					<Route component={Head} />
					<Switch>
						<Route exact path="/" component={ReviewPage}/>
						<Route exact path="/restaurants" >
							<ReviewPage tab={1}/>
						</Route>
						<Route exact path="/restaurant/:restaurant" component={RestaurantPage}/>
						<Route exact path="/admin" component={AdminPage}/>
						<Route path="*" component={NotFoundPage} />
					</Switch>
				</>
			</HashRouter>
		);
	}
}
