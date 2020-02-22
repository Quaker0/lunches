import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import stockholm from './content/stockholm.jpg'
import logo from './content/sthlm-lunch-logo.png'

export default class Head extends PureComponent {
	render() {
		return (
			<>
				<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossOrigin="anonymous"/>
	   			<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossOrigin="anonymous"/>
	    		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous"/>
	    		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossOrigin="anonymous"/>
	    		<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js"/>

	    		<div className="container-fluid sthlm-cover" style={{backgroundImage: `url(${stockholm})`, width:"100%", height:"500px", backgroundAttachment: "fixed", backgroundPosition: "center center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}>
		    		<div className="row navbar justify-content-start mx-2">
						<NavLink exact to="/" className="p-2 px-3 m-2 my-4 border border-dark rounded" title="Senaste Lunch Recensioner">Recensioner</NavLink>
						<NavLink exact to="/restaurants" className="p-2 px-3 m-2 my-4 border border-dark rounded" title="Lunch Restauranger - Best Lunch Stockholm - Bäst Lunch Stockholm">Restauranger</NavLink>
				    </div>
				    <img src={logo} alt="STHLM LUNCH" className="rounded mx-auto d-block"/>
				</div>
			</>
		);
	}
}