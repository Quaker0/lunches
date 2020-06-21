import React, { Component } from "react";
import NotFoundPage from "./NotFoundPage";
import AdminPage from "./admin/AdminPage";
import RestaurantPage from "./RestaurantPage";
import Head from "./Head";
import ReviewPage from "./ReviewPage";
import AsiaPage from "./AsiaPage";
import { HashRouter, Route, Switch } from "react-router-dom";

export default class App extends Component {
	render() {
		return (
			<HashRouter>
				<>
					<Route component={Head} />
					<Switch>
            <Route exact path="/" >
              <ReviewPage tab={0}/>
            </Route>
            <Route exact path="/recentReviews" >
              <ReviewPage tab={1}/>
            </Route>
						<Route exact path="/restaurants" >
							<ReviewPage tab={2}/>
						</Route>
						<Route exact path="/restaurant/:restaurant" component={RestaurantPage}/>
						<Route exact path="/admin" component={AdminPage}/>
            <Route exact path="/asia" component={AsiaPage}/>
						<Route path="*" component={NotFoundPage} />
					</Switch>
				</>
			</HashRouter>
		);
	}
}
