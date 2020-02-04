import React, { Component } from 'react';
import ReviewCard from './ReviewCard.js';


export default class AllReviewsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {"reviewCards": []}
  }

  componentDidMount() {
    fetch('http://lunch-static.s3-website.eu-north-1.amazonaws.com/reviews.json')
    .then((response) => {
      response.json()
      .then((reviews) => {
        if (reviews) {
          console.log(reviews)
          let reviewCards = [];
          reviews.forEach((review, idx) => reviewCards.push(<ReviewCard key={review.timestamp} review={review} idx={idx}/>));
          this.setState({"reviewCards": reviewCards})
        }
      }
      );
    })
  }

  render() {
    const { reviewCards } = this.state;
    return (
      <>
        <div className="container-fluid" style={{"backgroundColor": "#d3dadb"}}>
          <div className="row" style={{"padding": "50px 0 70px 0"}}>
            <div className="mx-auto">
              <div className="site-heading text-center">
                <h1>Lunch STHLM</h1>
                <span className="subheading text-center">Den enda lunch-guiden i Stockholm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div id="reviews" className="row">
           { reviewCards }
          </div>
        </div>
      </>
    );
  }
}