import "./style.css";
import { getLocationWeather } from "./weatherFetcher";

const form = document.getElementById("locationForm");

const searchLocationWeather = async (event) => {
	event.preventDefault();

	const formData = new FormData(event.target);
	const location = formData.get("location");
	const unitGroup = formData.get("unit-group");

	const weather = await getLocationWeather(location, unitGroup);

	console.log(weather.current);
};

form.addEventListener("submit", searchLocationWeather);
