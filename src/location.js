let currentLocation;

const fetchLocation = async () => {
	try {
		let response = await fetch("http://ip-api.com/json");

		if (response.ok) {
			const data = response.json();

			currentLocation = data;

			return data;
		}

		throw new Error(response.status);
	} catch (error) {
		return error.message;
	}
};

export const getLocation = async () => {
	if (currentLocation) {
		return currentLocation;
	}

	try {
		let rawData = await fetchLocation();
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
		return error.message;
	}
};
