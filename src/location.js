let currentLocation;
const apiKey = "db1a6a095b92433cbd60b6a44536219f";
const coordURL = "https://api.geoapify.com/v1/geocode/reverse?format=json";

const fetchLocationFromIp = async () => {
	let response = await fetch("http://ip-api.com/json");

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
			address: `${rawData.city}, ${rawData.country}`,
			country: rawData.country,
			countryCode: rawData.countryCode,
			city: rawData.city,
			lon: rawData.lon,
			lat: rawData.lat,
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
