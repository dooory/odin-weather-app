import { convert } from "convert";

const apiKey = "MUKZGWAK2SR7CVH3SAVSB8KQ4";

const weatherTimelineURL =
	"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

const measurements = {
	metric: {
		temp: "celsius",
		distance: "kilometers",
	},
	us: {
		temp: "fahrenheit",
		distance: "miles",
	},
};

const fetchLocationWeather = async (location, unitGroup) => {
	let url = `${weatherTimelineURL}/${location}?key=${apiKey}&unitGroup=${unitGroup}&contentType=json&include=current`;

	const response = await fetch(url);

	if (response.ok) {
		const data = await response.json();

		return data;
	}

	throw new Error(response.status);
};

const parseWeatherData = async (rawData) => {
	const weather = await {
		current: {
			datetimeEpoch: rawData.currentConditions.datetimeEpoch,
			feelslike: rawData.currentConditions.feelslike,
			temp: rawData.currentConditions.temp,
			maxTemp: rawData.days[0].tempmax,
			minTemp: rawData.days[0].tempmin,
			conditions: rawData.currentConditions.conditions,
			icon: rawData.currentConditions.icon,
			location: rawData.resolvedAddress,
			humidity: rawData.currentConditions.humidity,
			precip: rawData.currentConditions.precip,
			windspeed: rawData.currentConditions.windspeed,
			windgust: rawData.currentConditions.windgust,
		},
		days: [],
	};

	await rawData.days.forEach((day, index) => {
		if (index === 0) {
			return;
		}

		weather.days.push({
			icon: day.icon,
		});
	});

	return weather;
};

export const convertDataToUnitGroup = (data, oldUnitGroup, newUnitGroup) => {
	const oldTempUnit = measurements[oldUnitGroup].temp;
	const oldDistanceUnit = measurements[oldUnitGroup].distance;

	const newTempUnit = measurements[newUnitGroup].temp;
	const newDistanceUnit = measurements[newUnitGroup].distance;

	data.current.temp = convert(data.current.temp, oldTempUnit).to(newTempUnit);
	data.current.maxTemp = convert(data.current.maxTemp, oldTempUnit).to(
		newTempUnit,
	);
	data.current.minTemp = convert(data.current.minTemp, oldTempUnit).to(
		newTempUnit,
	);
	data.current.feelslike = convert(data.current.feelslike, oldTempUnit).to(
		newTempUnit,
	);

	data.current.windspeed = convert(
		data.current.windspeed,
		oldDistanceUnit,
	).to(newDistanceUnit);

	data.current.windgust = convert(data.current.windgust, oldDistanceUnit).to(
		newDistanceUnit,
	);

	return data;
};

export const getLocationWeather = async (location, unitGroup) => {
	try {
		const data = await fetchLocationWeather(location, unitGroup);
		const weather = await parseWeatherData(data);

		return weather;
	} catch (error) {
		throw new Error(`Could not get weather: ${error.message}`, {
			cause: error,
		});
	}
};

export const getCoordinatesWeather = async (location, unitGroup) => {
	try {
		const data = await fetchLocationWeather(
			`${location.lat},${location.lon}`,
			unitGroup,
		);
		let weather = await parseWeatherData(data);
		weather.current.location = location.city;

		return weather;
	} catch (error) {
		throw new Error(`Could not get weather: ${error.message}`, {
			cause: error,
		});
	}
};
