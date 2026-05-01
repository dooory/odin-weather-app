import { format, add } from "date-fns";
import { convert } from "convert";

const daySelectors = document.querySelectorAll(".day-selector");
const dayObjects = [...daySelectors].map((element) => {
	return {
		element: element,
		conditionIconEl: element.querySelector(".weather-icon"),
		temperatureEl: element.querySelector(".temperature"),
		dateShortEl: element.querySelector(".date-short"),
		dateFullEl: element.querySelector(".date-full"),
	};
});

const conditionIcons = {
	snow: "cloud-snow",
	"snow-showers-day": "cloud-snow",
	"snow-showers-night": "cloud-snow",
	"thunder-rain": "thunderstorm",
	"thunder-showers-day": "thunderstorm",
	"thunder-showers-night": "thunderstorm",
	rain: "cloud-showers",
	"showers-day": "cloud-showers",
	"showers-night": "cloud-showers",
	fog: "fog",
	wind: "wind-warning",
	cloudy: "cloud",
	"partly-cloudy-day": "cloud-sun",
	"partly-cloudy-night": "cloud-moon",
	"clear-day": "sun",
	"clear-night": "moon-stars",
};

const appEl = document.getElementById("App");

const currentLocationEl = document.getElementById("currentLocation");

const dayTitleEl = document.getElementById("dayTitle");
const dayMonthTitleEl = document.getElementById("dayMonthTitle");
const timeValueEl = document.getElementById("timeValue");

const precipEl = document.getElementById("precip");

const minTempEl = document.getElementById("minTemp");
const maxTempEl = document.getElementById("maxTemp");

const conditionIconEl = document.getElementById("conditionIcon");
const temperatureEl = document.getElementById("temperature");
const feelsLikeEl = document.getElementById("feelsLike");

const conditionTitleEl = document.getElementById("conditionTitle");
const weatherDescriptionEl = document.getElementById("weatherDescription");

const windSpeedEl = document.getElementById("windSpeed");
const windGustEl = document.getElementById("windGust");
const windMinSpeedEl = document.getElementById("minWindSpeed");
const windMaxSpeedEl = document.getElementById("maxWindSpeed");

const moonriseTimeEl = document.getElementById("moonRiseTime");
const moonsetTimeEl = document.getElementById("moonSetTime");

const sunriseTimeEl = document.getElementById("sunRiseTime");
const sunsetTimeEl = document.getElementById("sunSetTime");

const uvIndexEl = document.getElementById("uvIndex");

const units = {
	metric: {
		speed: "km/h",
		distance: "km",
		temperature: "celsius",
	},
	us: {
		speed: "mi/h",
		distance: "miles",
		temperature: "fahrenheit",
	},
};

function convertSpeed(oldSpeed, oldUnits, newUnits) {
	let oldDistanceUnit = units[oldUnits].distance;
	let newDistanceUnit = units[newUnits].distance;

	return convert(oldSpeed, oldDistanceUnit).to(newDistanceUnit);
}

function convertTemp(oldTemp, oldUnits, newUnits) {
	let oldTempUnit = units[oldUnits].temperature;
	let newTempUnit = units[newUnits].temperature;

	return convert(oldTemp, oldTempUnit).to(newTempUnit);
}

const windProperties = [
	"windspeed",
	"windgust",
	"windspeedmax",
	"windspeedmin",
];
const tempProperties = ["tempmax", "tempmin", "feelslike", "temp"];

const convertDayWeatherData = (data, oldUnits, newUnits) => {
	tempProperties.forEach((name) => {
		if (data[name]) {
			data[name] = convertTemp(data[name], oldUnits, newUnits);
		}
	});

	windProperties.forEach((name) => {
		if (data[name]) {
			data[name] = convertSpeed(data[name], oldUnits, newUnits);
		}
	});

	return data;
};

export const changePageUnits = (weather, oldUnits, newUnits) => {
	let speedUnitEls = document.querySelectorAll(".speed-unit");

	speedUnitEls.forEach((el) => {
		el.textContent = units[newUnits].speed;
	});

	if (weather.unitGroup === oldUnits) {
		for (let index = 0; index < 3; index++) {
			weather.days[index] = convertDayWeatherData(
				weather.days[index],
				oldUnits,
				newUnits,
			);
		}

		weather.currentConditions = convertDayWeatherData(
			weather.currentConditions,
			oldUnits,
			newUnits,
		);

		renderWeather(weather);
	} else {
		renderWeather(weather);
	}
};

export const renderMainWeather = (weather, targetDayIndex) => {
	weather = weather.days[targetDayIndex];

	const date = new Date(weather.datetimeEpoch * 1000);

	dayMonthTitleEl.textContent = format(date, "do MMM");

	if (weather.isToday === true) {
		dayTitleEl.textContent = "Today";
		timeValueEl.textContent = format(date, "p");
	} else {
		dayTitleEl.textContent = format(date, "EEEE");
		timeValueEl.classList.add("active");
	}

	precipEl.textContent = Number(weather.precip).toFixed(0);
	maxTempEl.textContent = Number(weather.tempmax).toFixed(0);
	minTempEl.textContent = Number(weather.tempmin).toFixed(0);

	conditionIconEl.classList = `fi condition-icon fi-rs-${conditionIcons[weather.icon]}`;
	temperatureEl.textContent = Number(weather.temp).toFixed(0);
	feelsLikeEl.textContent = Number(weather.feelslike).toFixed(0);

	conditionTitleEl.textContent = weather.conditions;
	weatherDescriptionEl.textContent = weather.description;

	windSpeedEl.textContent = Number(weather.windspeed).toFixed(0);
	windGustEl.textContent = Number(weather.windgust).toFixed(0);
	windMinSpeedEl.textContent = Number(weather.windspeedmin).toFixed(0);
	windMaxSpeedEl.textContent = Number(weather.windspeedmax).toFixed(0);

	moonriseTimeEl.textContent = format(
		new Date(weather.moonriseEpoch * 1000),
		"p",
	);
	moonsetTimeEl.textContent = format(
		new Date(weather.moonsetEpoch * 1000),
		"p",
	);

	sunriseTimeEl.textContent = format(
		new Date(weather.sunriseEpoch * 1000),
		"p",
	);
	sunsetTimeEl.textContent = format(
		new Date(weather.sunsetEpoch * 1000),
		"p",
	);

	uvIndexEl.textContent = weather.uvindex;
};

export const renderWeather = (weather) => {
	currentLocationEl.textContent = weather.resolvedAddress;

	for (const [key, value] of Object.entries(weather.currentConditions)) {
		weather.days[0][key] = value;
	}

	const currentTargetDay = dayObjects.findIndex((obj) => {
		return obj.element.classList.contains("active");
	});

	dayObjects.forEach((obj, index) => {
		const data = weather.days[index];
		const date = new Date(data.datetimeEpoch * 1000);

		obj.temperatureEl.textContent = Number(data.temp).toFixed(0);
		obj.dateFullEl.textContent = format(date, "do MMM");
		obj.dateShortEl.textContent =
			index === 0 ? "NOW" : format(date, "eee").toUpperCase();

		obj.conditionIconEl.classList = "fi weather-icon";
		obj.conditionIconEl.classList.add("fi-rs-" + conditionIcons[data.icon]);
	});

	renderMainWeather(weather, currentTargetDay);

	appEl.dataset.loadedWeather = true;
};
