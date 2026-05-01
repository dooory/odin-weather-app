import "./style.css";
import { getLocation } from "./location";
import {
	getCoordinatesWeather,
	getLocationWeather,
	convertDataToUnitGroup,
} from "./weather";
import { renderWeather, renderMainWeather, changePageUnits } from "./renderer";

const unitGroupSwitch = document.getElementById("unitGroupSwitch");
const searchBar = document.getElementById("searchForLocation");
const searchForm = document.getElementById("searchForm");

const useLocationButton = document.getElementById("useLocation");

let lastWeatherReport;

const unitGroups = ["metric", "us"];

const searchLocationWeather = async (event) => {
	event.preventDefault();

	const formData = new FormData(event.target);
	const location = formData.get("search-for-location");
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

		searchBar.value = location.address;

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
