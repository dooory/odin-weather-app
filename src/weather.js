const apiKey = "MUKZGWAK2SR7CVH3SAVSB8KQ4";

const weatherTimelineURL =
	"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

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

export const getCoordinatesWeather = async (lat, lon, unitGroup) => {
	try {
		const data = await fetchLocationWeather(`${lat},${lon}`, unitGroup);
		const weather = await parseWeatherData(data);

		return weather;
	} catch (error) {
		throw new Error(`Could not get weather: ${error.message}`, {
			cause: error,
		});
	}
};
