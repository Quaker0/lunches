import React, { Component } from 'react';
import NotFoundPage from './NotFoundPage.js';
import AllReviewsPage from './AllReviewsPage.js';
import AddReviewPage from './AddReviewPage.js';
import RestaurantReviewsPage from './RestaurantReviewsPage.js';
import RestaurantPage from './RestaurantPage.js';
import Head from './Head.js';

import {
  HashRouter,
  Route,
  Switch,
} from 'react-router-dom';

export default class App extends Component {
  render() {
    return (
      <HashRouter>
        <>
          <Route component={Head} />
          <Switch>
            <Route exact path="/" component={AllReviewsPage}/>
            <Route exact path="/restaurants" component={RestaurantReviewsPage}/>
            <Route exact path="/restaurant/:restaurant" component={RestaurantPage}/>
            <Route exact path="/add-review" component={AddReviewPage}/>
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </>
      </HashRouter>
    );
  }
}
