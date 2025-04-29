import axios from 'axios'
const allCountriesUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getCountries = () => {
	const request = axios.get(allCountriesUrl)
	return request.then(response => response.data)
}

export default { getCountries }