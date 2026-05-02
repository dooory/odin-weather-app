import "./style.css";
import { getLocationFromIp, getAddressFromCoords } from "./location";
import { getCoordinatesWeather, getLocationWeather } from "./weather";
import { renderWeather, renderMainWeather, changePageUnits } from "./renderer";

const unitGroupSwitch = document.getElementById("unitGroupSwitch");
const searchBar = document.getElementById("searchForLocation");
const searchForm = document.getElementById("searchForm");
const currentLocation = document.getElementById("currentLocation");

const useLocationButton = document.getElementById("useLocation");

let lastWeatherReport;

const unitGroups = ["metric", "us"];

const displayError = (error) => {
	currentLocation.classList.add("error");

	if (error.message.endsWith("400")) {
		currentLocation.textContent = "Invalid Location :c";
	} else {
		console.error(error);
	}
};

const searchLocationWeather = async (event) => {
	event.preventDefault();

	const formData = new FormData(event.target);
	const unitGroup = unitGroupSwitch.dataset.unitGroup;

	try {
		const location = formData.get("search-for-location");
		const weather = await getLocationWeather(location, unitGroup);

		weather.resolvedAddress = await getAddressFromCoords(
			weather.longitude,
			weather.latitude,
		);

		currentLocation.classList.remove("error");

		lastWeatherReport = weather;

		renderWeather(weather);
	} catch (error) {
		displayError(error);
	}
};

const searchCoordinatesWeather = async () => {
	try {
		const location = await getLocationFromIp();
		const weather = await getCoordinatesWeather(
			location,
			unitGroupSwitch.dataset.unitGroup,
		);

		searchBar.value = location.address;
		currentLocation.classList.remove("error");

		lastWeatherReport = weather;

		renderWeather(weather);
	} catch (error) {
		displayError(error);
	}
};

const toggleUnitGroup = async () => {
	const oldUnitGroup = unitGroupSwitch.dataset.unitGroup;
	const newUnitGroup =
		oldUnitGroup === unitGroups[0] ? unitGroups[1] : unitGroups[0];

	unitGroupSwitch.dataset.unitGroup = newUnitGroup;

	if (!lastWeatherReport) {
		return;
	}

	let weather = structuredClone(lastWeatherReport);

	changePageUnits(weather, oldUnitGroup, newUnitGroup);
};

searchForm.addEventListener("submit", searchLocationWeather);

useLocationButton.addEventListener("click", () => {
	searchCoordinatesWeather();
});

unitGroupSwitch.addEventListener("click", toggleUnitGroup);

const daySelectorSection = document.getElementById("daySelectorSection");
const daySelectors = document.querySelectorAll(".day-selector");

daySelectorSection.addEventListener("click", (event) => {
	daySelectors.forEach((button, index) => {
		if (button.contains(event.target)) {
			button.classList.add("active");

			const currentUnitGroup = unitGroupSwitch.dataset.unitGroup;
			const lastUnitGroup = lastWeatherReport.unitGroup;

			if (lastUnitGroup !== currentUnitGroup) {
				changePageUnits(
					structuredClone(lastWeatherReport),
					lastUnitGroup,
					currentUnitGroup,
				);

				return;
			}

			renderMainWeather(lastWeatherReport, index);
		} else {
			button.classList.remove("active");
		}
	});
});
