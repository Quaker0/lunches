import React, { Component, lazy } from "react";

import { LineMarkSeries ,VerticalBarSeries, XYPlot, HorizontalGridLines, VerticalGridLines, XAxis, YAxis, DiscreteColorLegend } from "react-vis";
const Box = lazy(() => import("@material-ui/core/Box"));
const Button = lazy(() => import("@material-ui/core/Button"));
const TimelineIcon = lazy(() => import("@material-ui/icons/Timeline"));
const BarChartIcon = lazy(() => import("@material-ui/icons/BarChart"));

import { sortBy, orderBy, ceil, max, flatten } from "lodash";

const months = ["Jan", "Feb", "Mar","Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default class StatPage extends Component {
	constructor() {
		super();
		this.state = {screenWidth: 500, chart: "line", userMeta: {}};
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
					const currentDatetime = new Date(entry[0])
					const formattedDate = currentDatetime.getDate() + " " + months[currentDatetime.getMonth()]
					series.push({x: formattedDate, y: entry[1], i: 12 * currentDatetime.getMonth() + currentDatetime.getDate()});
				});
				eventSeries[event] = sortBy(series, "i");
			});
			this.setState({eventSeries: eventSeries});
		});

    fetch("https://www.sthlmlunch.se/userMeta.json")
    .then((response) => response.json())
    .then((userMeta) => {
      this.setState({userMeta: userMeta})
    });
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ screenWidth: window.innerWidth });
	}

	render() {
		const { userMeta, eventSeries, screenWidth, chart } = this.state;
		if (!eventSeries) {
			return <></>;
		}

		let lines = Object.keys(eventSeries).map((event) => <LineMarkSeries key={event} data={eventSeries[event]}/>);
		if (chart === "bar") {
			lines = Object.keys(eventSeries).map((event) => <VerticalBarSeries key={event} data={eventSeries[event]}/>);
		}
		const maxY = ceil(max(flatten(Object.values(eventSeries)).map((point)=>point.y)) / 10) * 10;
    const userData = orderBy(Object.entries(userMeta).map(([reviewer, reviews]) => ({x: reviewer, y: reviews.length})), "y", "desc");

		return (
      <div style={{minHeight: 800}}>
        <h4 className="text-center" style={{marginTop: 40, marginBottom: -75}}>Events</h4>
				<Box display="flex" justifyContent="flex-start" m={5} >
					<Button variant="contained" color={chart === "line" ? "primary" : "default"} onClick={() => this.setState({chart: "line"})} >
						<TimelineIcon/>
					</Button>
					<Button variant="contained" color={chart === "bar" ? "primary" : "default"} onClick={() => this.setState({chart: "bar"})} >
						<BarChartIcon/>
					</Button>
				</Box>
				<XYPlot
          margin={{left: 60, right: 60}}
					xType="ordinal"
					width={screenWidth}
					height={200}
				>
					<HorizontalGridLines />
					<VerticalGridLines />
					<XAxis/>
					<YAxis yDomain={[0, maxY]} />
					{ lines }
				</XYPlot>
				<DiscreteColorLegend
					orientation="horizontal"
					items={(Object.keys(eventSeries) || []).map((eventName) => ({data: eventSeries[eventName], title: eventName}))}
				/>
        { 
          userData.length ? (
            <div style={{marginTop: 60}}>
              <h4 className="text-center">Recensioner gjorda</h4>
              <XYPlot height={300} width={screenWidth} xType="ordinal" stackBy="y">
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <VerticalBarSeries data={userData} />
              </XYPlot>
            </div>
          ) : <></>
        }
      </div>
		);
	}
}


function getStats() {
	return fetch("https://www.sthlmlunch.se/statistics.json")
		.then((response) => response.json());
}
