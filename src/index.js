import "./style.css";
import { getLocation } from "./location";
import { getCoordinatesWeather, getLocationWeather } from "./weather";

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

const searchLocationWeather = async (event) => {
	event.preventDefault();

	const formData = new FormData(event.target);
	const location = formData.get("location");
	const unitGroup = unitGroupSwitch.dataset.unitGroup;

	const weather = await getLocationWeather(location, unitGroup);

	console.log(weather.current);
};

const searchCoordinatesWeather = async () => {
	try {
		const location = await getLocation();
		const weather = await getCoordinatesWeather(
			location.lat,
			location.lon,
			unitGroupSwitch.dataset.unitGroup,
		);

		searchField.value = location.address;

		console.log(weather.current);
	} catch (error) {
		console.error(error);
	}
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
