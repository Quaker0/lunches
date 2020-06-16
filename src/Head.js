import React, { PureComponent } from "react";
import stockholmjp2 from "./content/stockholm-brown.jp2"
import stockholmwebp from "./content/stockholm-brown.webp"
import textLogo from "./content/sthlm-lunch-slope.png"

export default class Head extends PureComponent {
	render() {
		return (
			<>
				<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossOrigin="anonymous"/>
				<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossOrigin="anonymous"/>
				<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous"/>
				<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossOrigin="anonymous"/>
				<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js"/>

				<div className="container-fluid sthlm-cover" style={{backgroundImage: `url(${stockholmwebp}), url(${stockholmjp2})`, width:"100%", height:"60vh", backgroundAttachment: "fixed", backgroundPosition: "center center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}} >
					<div className="row h-75 justify-content-center align-items-center">
            <img src={textLogo} alt="STHLM LUNCH" className="site-logo-text mt-5" height="100%"/>
					</div>
				</div>
			</>
		);
	}
}