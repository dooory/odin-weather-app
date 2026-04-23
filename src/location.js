let currentLocation;

export const fetchLocation = async () => {
	if (currentLocation) {
		return currentLocation;
	}

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
