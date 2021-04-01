import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Nav from "./Nav";
import Footer from "./Footer";
import RecentReviewsPage from "./RecentReviewsPage";
import RestaurantPage from "./RestaurantPage";
import RestaurantReviewsPage from "./RestaurantReviewsPage";
import RestaurantToplist from "./RestaurantToplist";

const NotFoundPage = lazy(() => import("./NotFoundPage"));
const AddPage = lazy(() => import("./admin/AddPage"));
const EditPage = lazy(() => import("./admin/EditPage"));
const StatPage = lazy(() => import("./admin/StatPage"));
const UserPage = lazy(() => import("./admin/UserPage"));
const Head = () => (
  <div className="container-fluid sthlm-cover">
    <h1 className="neon-sign d-flex flex-wrap">
      <span className="neon-first-letter">S</span>
      <span className="d-flex flex-column flex-wrap">
        <span>THLM</span>
        <span>LUNCH</span>
      </span>
    </h1>
  </div>
);


export default function App() {
	return (
    <Suspense fallback={<></>}>
      <Router>
        <>
          <Route />
          <Head />
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
              <Route path="*" component={NotFoundPage} />
            </Switch>
          </div>
          <Footer />
        </>
      </Router>
    </Suspense>
	);
}
