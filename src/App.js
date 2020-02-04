import React, { Component } from 'react';
import NotFoundPage from './NotFoundPage.js';
import AllReviewsPage from './AllReviewsPage.js';
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
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </>
      </HashRouter>
    );
  }
}
