import axios from 'axios'
const currentWeatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=LATITUDE&lon=LONGITUDE&appid=API_KEY&units=metric'
const openweatherApiKey = import.meta.env.VITE_OPENWEATHER_APIKEY

const getCurrentWeather = (lat, long) => {
    const url = currentWeatherBaseUrl
        .replace('LATITUDE', lat.toString())
        .replace('LONGITUDE', long.toString())
        .replace('API_KEY', openweatherApiKey)
	const request = axios.get(url)
	return request.then(response => response.data)
}

export default { getCurrentWeather }