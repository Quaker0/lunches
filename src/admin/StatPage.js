import React, { Component } from "react";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, VerticalBarSeries, LineMarkSeries, DiscreteColorLegend} from "react-vis";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TimelineIcon from "@material-ui/icons/Timeline";
import BarChart from "@material-ui/icons/BarChart";
import { List } from "immutable";
import _ from "lodash";

const months = ["Jan", "Feb", "Mar","Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default class StatPage extends Component {
	constructor() {
		super();
		this.state = {screenWidth: 500, chart: "line"};
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}
	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener("resize", this.updateWindowDimensions);
		getStats().then((stats) => {
			let eventSeries = {};
			Object.keys(stats.series.values).forEach((event) => {
				let series = [];
				Object.entries(stats.series.values[event]).forEach((entry) => {
					const current_datetime = new Date(entry[0])
					const formatted_date = current_datetime.getDate() + " " + months[current_datetime.getMonth()]
					series.push({x: formatted_date, y: entry[1]});
				});
				eventSeries[event] = series;
			});
			this.setState({eventSeries: eventSeries});
		});
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ screenWidth: window.innerWidth });
	}

	render() {
		const { eventSeries, screenWidth, chart } = this.state;
		if (!eventSeries) {
			return <></>;
		}

		let lines = List(Object.keys(eventSeries)).map((event) => <LineMarkSeries key={event} data={eventSeries[event]}/>);
		if (chart === "bar") {
			lines = List(Object.keys(eventSeries)).map((event) => <VerticalBarSeries key={event} data={eventSeries[event]}/>);
		}
		const maxY = _.ceil(_.max(_(eventSeries).values().flatten().map((point)=>point.y).value()) / 10) * 10;

		return (
			<>
				<Box display="flex" justifyContent="flex-start" ml={5} >
					<Button variant="contained" color={chart === "line" ? "primary" : "default"} onClick={() => this.setState({chart: "line"})} >
						<TimelineIcon/>
					</Button>
					<Button variant="contained" color={chart === "bar" ? "primary" : "default"} onClick={() => this.setState({chart: "bar"})} >
						<BarChart/>
					</Button>
				</Box>
				<XYPlot
					xType="ordinal"
					width={screenWidth}
					height={300}
				>
					<HorizontalGridLines />
					<VerticalGridLines />
					<XAxis />
					<YAxis yDomain={[0, maxY]} />
					{ lines }
				</XYPlot>
				<DiscreteColorLegend
					orientation="horizontal"
					items={List(Object.keys(eventSeries) || []).map((eventName) => ({data: eventSeries[eventName], title: eventName})).toArray()}
				/>
			</>
		);
	}
}


function getStats() {
	return fetch("https://www.sthlmlunch.se/statistics.json")
		.then((response) => response.json());
}
