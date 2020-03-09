import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

export default class SearchBar extends Component {
  render() {
    const { search, sortBy } = this.props;

    return (
      <div className="container" style={{width:"90%", "maxWidth": "800px"}}>
          <div className="row justify-content-center py-2">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Search for restaurant" aria-label="" aria-describedby="searchbar" onChange={search} onKeyUp={search} onPaste={search} onInput={search} />
              <Dropdown>
                <Dropdown.Toggle id="sort-dropdown" variant="custom">
                  Sortera på
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item id="tasteScore" key="tasteScore" onClick={sortBy} >Bäst smak</Dropdown.Item>
                  <Dropdown.Item id="evnironmentScore" key="environmentScore" onClick={sortBy} >Bäst omgivning</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      );
    }
  }
