import React, { Component } from 'react';

export default class SearchBar extends Component {
  render() {
    const { toggleTaste, toggleDateCheckbox, toggleValueCheckbox, toggleInnovationCheckbox, search } = this.props;

    return (
      <div className="container" style={{width:"90%", "maxWidth": "800px"}}>
          <div className="input-group row justify-content-between py-2">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" onClick={toggleTaste} id="bestTasteCheckbox" value="bestTaste"/>
                <label className="form-check-label" htmlFor="bestTasteCheckbox"><i className="fas fa-trophy fa-sm p-1" style={{color:"gold"}}/><span className="font-weight-light">Bäst smak</span></label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" onClick={toggleValueCheckbox} id="mostValueCheckbox" value="mostValue"/>
                <label className="form-check-label" htmlFor="mostValueCheckbox"><i className="fas fa-award fa-sm p-1" style={{color:"mediumseagreen"}}/><span className="font-weight-light">Mest värde</span></label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" onClick={toggleDateCheckbox} id="bestDateCheckbox" value="bestDate"/>
                <label className="form-check-label" htmlFor="bestDateCheckbox"><i className="fas fa-heart fa-sm p-1" style={{color:"red"}}/><span className="font-weight-light">Bästa dejt</span></label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" onClick={toggleInnovationCheckbox} id="mostInnovativeCheckbox" value="mostInnovative"/>
                <label className="form-check-label" htmlFor="mostInnovativeCheckbox"><i className="fas fa-pencil-ruler fa-sm p-1" style={{color:"sandybrown"}}/><span className="font-weight-light">Mest nytänkande</span></label>
              </div>
          </div>
          <div className="row justify-content-center py-2">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Search for restaurant" aria-label="" aria-describedby="searchbar" onChange={search} onKeyUp={search} onPaste={search} onInput={search} />
            </div>
          </div>
        </div>
      );
    }
  }
