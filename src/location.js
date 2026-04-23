let currentLocation;

const fetchLocation = async () => {
	let response = await fetch("http://ip-api.com/json");

	if (response.ok) {
		const data = response.json();

		currentLocation = data;

		return data;
	}

	throw new Error(`HTTP ${response.status}`);
};

export const getLocation = async () => {
	if (currentLocation) {
		return currentLocation;
	}

	try {
		const rawData = await fetchLocation();

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
