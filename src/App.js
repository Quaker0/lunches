import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Head from "./Head";
import Nav from "./Nav";
import Footer from "./Footer";

const NotFoundPage = lazy(() => import("./NotFoundPage"));
const RestaurantPage = lazy(() => import("./RestaurantPage"));
const RecentReviewsPage = lazy(() => import("./RecentReviewsPage"));
const RestaurantReviewsPage = lazy(() => import("./RestaurantReviewsPage"));
const RestaurantToplist = lazy(() => import("./RestaurantToplist"));
const AsiaPage = lazy(() => import("./AsiaPage"));
const AddPage = lazy(() => import("./admin/AddPage"));
const EditPage = lazy(() => import("./admin/EditPage"));
const StatPage = lazy(() => import("./admin/StatPage"));
const UserPage = lazy(() => import("./admin/UserPage"));


export default function App() {
	return (
    <Suspense fallback={<></>}>
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
    </Suspense>
	);
}
