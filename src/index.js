import "./style.css";
import { getLocation } from "./location";
import {
	getCoordinatesWeather,
	getLocationWeather,
	convertDataToUnitGroup,
} from "./weather";
import { renderWeather } from "./renderer";

const form = document.getElementById("locationForm");
const getMyWeatherButton = document.getElementById("getMyWeather");
const searchField = document.getElementById("searchLocation");
const confirmDialog = document.getElementById("confirmDialog");
const confirmButton = document.getElementById("confirmButton");
const denyButton = document.getElementById("denyButton");

const unitGroupSwitch = document.getElementById("unitSwitch");

let locationAccessAllowed = Number(
	localStorage.getItem("locationAccessAllowed"),
);

let lastWeatherReport;

const unitGroups = ["metric", "us"];

const searchLocationWeather = async (event) => {
	event.preventDefault();

	const formData = new FormData(event.target);
	const location = formData.get("location");
	const unitGroup = unitGroupSwitch.dataset.unitGroup;

	const weather = await getLocationWeather(location, unitGroup);

	lastWeatherReport = weather;

	renderWeather(weather);
};

const searchCoordinatesWeather = async () => {
	try {
		const location = await getLocation();
		const weather = await getCoordinatesWeather(
			location,
			unitGroupSwitch.dataset.unitGroup,
		);

		searchField.value = location.address;

		lastWeatherReport = weather;

		renderWeather(weather);
	} catch (error) {
		console.error(error);
	}
};

const toggleUnitGroup = async () => {
	const oldUnitGroup = unitGroupSwitch.dataset.unitGroup;
	const newUnitGroup =
		oldUnitGroup === unitGroups[0] ? unitGroups[1] : unitGroups[0];

	unitGroupSwitch.dataset.unitGroup = newUnitGroup;
	unitGroupSwitch.textContent = newUnitGroup === unitGroups[0] ? "°C" : "°F";

	if (!lastWeatherReport) {
		return;
	}

	console.log(lastWeatherReport.current.temp);

	const convertedData = convertDataToUnitGroup(
		lastWeatherReport,
		oldUnitGroup,
		newUnitGroup,
	);

	lastWeatherReport = convertedData;

	renderWeather(convertedData);
};

form.addEventListener("submit", searchLocationWeather);

getMyWeatherButton.addEventListener("click", () => {
	if (locationAccessAllowed !== 1) {
		confirmDialog.showModal();

		return;
	}

	searchCoordinatesWeather();
});

confirmButton.addEventListener("click", () => {
	locationAccessAllowed = 1;
	localStorage.setItem("locationAccessAllowed", 1);

	searchCoordinatesWeather();
});

denyButton.addEventListener("click", () => {
	locationAccessAllowed = 0;
	localStorage.removeItem("locationAccessAllowed");
});

unitGroupSwitch.addEventListener("click", toggleUnitGroup);
