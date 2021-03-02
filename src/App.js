import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import NotFoundPage from "./NotFoundPage";
import RestaurantPage from "./RestaurantPage";
import Head from "./Head";
import RecentReviewsPage from "./RecentReviewsPage";
import RestaurantReviewsPage from "./RestaurantReviewsPage";
import RestaurantToplist from "./RestaurantToplist";
import AsiaPage from "./AsiaPage";
import Nav from "./Nav";
import Footer from "./Footer";
import AddPage from "./admin/AddPage";
import EditPage from "./admin/EditPage";
import StatPage from "./admin/StatPage";
import UserPage from "./admin/UserPage";


export default function App() {
	return (
		<Router>
			<>
				<Route component={Head} />
        <Nav />
        <div id="main">
          <Switch>
            <Route exact path="/" render={props => {
                if (props.location.hash) return <Redirect to={props.location.hash.substring(1)}/>
                return <Redirect push to="/recent" />
              }}
            />
            <Route exact path="/top" component={RestaurantToplist} />
            <Route exact path="/recent" component={RecentReviewsPage} />
            <Route exact path="/restaurants" component={RestaurantReviewsPage} />
            <Route exact path="/restaurant/:restaurant" component={RestaurantPage} />
            <Route exact path="/admin/user" component={UserPage} />
            <Route exact path="/admin/add" component={AddPage} />
            <Route exact path="/admin/edit" component={EditPage} />
            <Route exact path="/admin/stats" component={StatPage} />
            <Route exact path="/admin">
              <Redirect to="/admin/add" />
            </Route>
            <Route exact path="/asia" component={AsiaPage} />
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </div>
        <Footer />
			</>
		</Router>
	);
}
