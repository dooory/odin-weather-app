const apiKey = "MUKZGWAK2SR7CVH3SAVSB8KQ4";

const weatherTimelineURL =
	"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

const fetchLocationWeather = async (location, unitGroup) => {
	let url = `${weatherTimelineURL}/${location}?key=${apiKey}&unitGroup=${unitGroup}&contentType=json&include=current`;

	try {
		const response = await fetch(url);

		if (response.ok) {
			const data = await response.json();

			return data;
		}

		throw new Error(response.status);
	} catch (err) {
		return err.message;
	}
};

export const getLocationWeather = async (location, unitGroup) => {
	try {
		const rawData = await fetchLocationWeather(location, unitGroup);
		const weather = await {
			current: {
				feelslike: rawData.currentConditions.feelslike,
				temp: rawData.currentConditions.temp,
				conditions: rawData.currentConditions.conditions,
				icon: rawData.currentConditions.icon,
				location: rawData.resolvedAddress,
			},
		};

		return weather;
	} catch (err) {
		return err.message;
	}
};
