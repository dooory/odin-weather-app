import "./style.css";
import WeatherFetcher from "./weatherFetcher";

WeatherFetcher.getLocationWeather("New York", "metric").then((data) => {
	console.log(data.current);
});
