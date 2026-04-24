import { format, add } from "date-fns";

const temperatureText = document.getElementById("temperature");
const highTempText = document.getElementById("high");
const lowTempText = document.getElementById("low");

const unitSwitch = document.getElementById("unitSwitch");

const currentTimeText = document.getElementById("currentTime");
const currentDateText = document.getElementById("currentDate");

const precipitationText = document.getElementById("precipitation");
const windText = document.getElementById("wind");
const humidityText = document.getElementById("humidity");

const forecastItems = document.querySelectorAll(".forecast-item");
const forecastObjects = [...forecastItems].map((element) => {
	return {
		dayElement: element.querySelector(".day"),
		conditionElement: element.querySelector(".condition"),
	};
});

export const renderWeather = (weather) => {
	temperatureText.textContent = `${weather.current.temp}°`;

	highTempText.textContent = `${weather.current.maxTemp}°`;
	lowTempText.textContent = `${weather.current.minTemp}°`;

	const currentDate = new Date(weather.current.datetimeEpoch);

	currentTimeText.textContent = format(currentDate, "hh:mm aaa");
	currentDateText.textContent = format(currentDate, "EEEE, do LLL");

	precipitationText.textContent = `Precipitation: ${weather.current.precip}%`;
	humidityText.textContent = `Humidity: ${weather.current.humidity}%`;
	windText.textContent = `Wind: ${weather.current.windspeed} ${unitSwitch.dataset.unitGroup === "metric" ? "km/h" : "mi/h"}`;

	forecastObjects.forEach((item, key) => {
		const forecastWeather = weather.days[key];
		const forecastCondition = forecastWeather.icon;

		const forecastDate = add(currentDate, {
			days: key + 1,
		});

		item.conditionElement.textContent = forecastCondition;

		item.dayElement.textContent = format(forecastDate, "E").toUpperCase();
	});

	console.log(weather);
};
