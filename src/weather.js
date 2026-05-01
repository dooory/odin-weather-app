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
	let url = `${weatherTimelineURL}/${location}?key=${apiKey}&unitGroup=${unitGroup}&contentType=json&include=current&elements=add:windspeedmax,add:windspeedmin,add:moonsetEpoch,add:moonriseEpoch&iconSet=icons2`;

	const response = await fetch(url);

	if (response.ok) {
		const data = await response.json();

		return data;
	}

	throw new Error(response.status);
};

export const convertDataToUnitGroup = (data, oldUnitGroup, newUnitGroup) => {
	const oldTempUnit = measurements[oldUnitGroup].temp;
	const oldDistanceUnit = measurements[oldUnitGroup].distance;

	const newTempUnit = measurements[newUnitGroup].temp;
	const newDistanceUnit = measurements[newUnitGroup].distance;

	data.currentConditions.temp = convert(
		data.currentConditions.temp,
		oldTempUnit,
	).to(newTempUnit);
	data.currentConditions.tempmax = convert(
		data.currentConditions.tempmax,
		oldTempUnit,
	).to(newTempUnit);
	data.currentConditions.tempmin = convert(
		data.currentConditions.tempmin,
		oldTempUnit,
	).to(newTempUnit);
	data.currentConditions.feelslike = convert(
		data.currentConditions.feelslike,
		oldTempUnit,
	).to(newTempUnit);

	data.currentConditions.windspeed = convert(
		data.currentConditions.windspeed,
		oldDistanceUnit,
	).to(newDistanceUnit);

	data.currentConditions.windgust = convert(
		data.currentConditions.windgust,
		oldDistanceUnit,
	).to(newDistanceUnit);

	return data;
};

export const getLocationWeather = async (location, unitGroup) => {
	try {
		let data = await fetchLocationWeather(location, unitGroup);
		data.unitGroup = unitGroup;

		return data;
	} catch (error) {
		throw new Error(`Could not get weather: ${error.message}`, {
			cause: error,
		});
	}
};

export const getCoordinatesWeather = async (location, unitGroup) => {
	try {
		let data = await fetchLocationWeather(
			`${location.lat},${location.lon}`,
			unitGroup,
		);

		data.unitGroup = unitGroup;
		data.resolvedAddress = location.address;

		return data;
	} catch (error) {
		throw new Error(`Could not get weather: ${error.message}`, {
			cause: error,
		});
	}
};
