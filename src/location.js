let currentLocation;
const apiKey = "db1a6a095b92433cbd60b6a44536219f";
const coordURL = "https://api.geoapify.com/v1/geocode/reverse?format=json";

const fetchLocationFromIp = async () => {
	let response = await fetch("https://ipapi.co/json");

	if (response.ok) {
		const data = response.json();

		currentLocation = data;

		return data;
	}

	throw new Error(`HTTP ${response.status}`);
};

const fetchAddressFromCoords = async (lon, lat) => {
	let response = await fetch(
		`${coordURL}&lat=${lat}&lon=${lon}&apiKey=${apiKey}`,
	);

	if (response.ok) {
		const data = response.json();
		return data;
	}

	throw new Error(`HTTP ${response.status}`);
};

export const getLocationFromIp = async () => {
	if (currentLocation) {
		return currentLocation;
	}

	try {
		const rawData = await fetchLocationFromIp();

		currentLocation = {
			address: `${rawData.city}, ${rawData.country_name}`,
			country: rawData.country_name,
			countryCode: rawData.country,
			city: rawData.city,
			lon: rawData.latitude,
			lat: rawData.latitude,
		};

		return currentLocation;
	} catch (error) {
		throw new Error(`Could not get user location: ${error.message}`, {
			cause: error,
		});
	}
};

export const getAddressFromCoords = async (lat, lon) => {
	try {
		const rawData = await fetchAddressFromCoords(lat, lon);

		const results = rawData.results[0];

		return `${results.city}, ${results.country}`;
	} catch (error) {
		throw new Error(`Could not get coord location: ${error.message}`, {
			cause: error,
		});
	}
};
