import React, { Component } from "react";
import Dropdown from "react-bootstrap/Dropdown";

export default class SearchBar extends Component {
	render() {
		const { search, sortBy } = this.props;
		var sortByDropdown = <></>;
		if (sortBy) {
			sortByDropdown = (
				<Dropdown>
					<Dropdown.Toggle id="sort-dropdown" variant="custom">
						Sortera på
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item id="tasteScore" key="tasteScore" onClick={sortBy} >Bäst smak</Dropdown.Item>
						<Dropdown.Item id="environmentScore" key="environmentScore" onClick={sortBy} >Bäst omgivning</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			);
    }

		return (
			<div className="container" style={{width:"90%", "maxWidth": "800px", padding: 20}}>
				<div className="row justify-content-center py-2">
					<div className="input-group">
						<input type="text" className="form-control" placeholder="Sök efter restaurang" aria-label="" aria-describedby="searchbar" onChange={search} onKeyUp={search} onPaste={search} onInput={search} />
						{ sortByDropdown }
					</div>
				</div>
			</div>
		);
  }
}
