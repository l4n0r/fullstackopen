import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const Result = ({ countries, showCountry, weatherReport }) => {
	const openweatherIconBaseUrl = 'https://openweathermap.org/img/wn/'
	const weatherDescToImage = {
		"clear sky": "01d.png",
		"few clouds": "02d.png",
		"scattered clouds": "03d.png",
		"broken clouds": "04d.png",
		"shower rain": "09d.png",
		"rain": "10d.png",
		"thunderstorm": "11d.png",
		"snow": "13d.png",
		"mist": "50d.png"
	}

	if (countries.length > 10) return (
		<p>Too many matches, specifiy another filter</p>
	)
	
	if (countries.length > 1) return (
		<ul>
			{countries.map(c => 
				<li key={c.name.common}>
					{c.name.common}
					<button value={c.name.common} onClick={showCountry}>Show</button>
				</li>
			)}
		</ul>
	)

	if (countries.length === 1) {
		const filteredCountry = countries[0]
		const languages = Object.values(filteredCountry.languages)
		const flagUrl = filteredCountry.flags.png

		const temperature = weatherReport !== null ? weatherReport.main.temp : ''
		const weatherImageUrl = weatherReport !== null ? 
			openweatherIconBaseUrl + weatherDescToImage[weatherReport.weather[0].description]
			: null
		const windSpeed = weatherReport !== null ? weatherReport.wind.speed : ''

		return (
			<div>
				<h1>{filteredCountry.name.common}</h1>
				<p>Capital {filteredCountry.capital}</p>
				<p>Area {filteredCountry.area}</p>

				<h2>Languages</h2>
				<ul>
					{languages.map(language => <li key={language}>{language}</li>)}
				</ul>
				<img src={flagUrl} />

				<h2>Weather in {filteredCountry.capital}</h2>
				<p>Temperature {temperature} Celsius</p>
				<img src={weatherImageUrl} />
				<p>Wind {windSpeed} m/s</p>
			</div>
		)
	}
}

const App = () => {
	const [countryFilter, setCountryFilter] = useState('')
	const [filteredCountries, setFilteredCountries] = useState([])
	const [weatherReport, setWeatherReport] = useState(null)

	const onChangeCountryFilter = event => {
		event.preventDefault()
		setCountryFilter(event.target.value)
	}

	const filterCountries = () => {
		countryService
			.getCountries()
			.then(countries => {
				const filteredCountries_ = countries.filter(c => c.name.common.toLowerCase().includes(countryFilter.toLowerCase()))
				setFilteredCountries(filteredCountries_)

				if (filteredCountries_.length == 1) {
					const [lat, long] = filteredCountries_[0].capitalInfo.latlng
					weatherService
						.getCurrentWeather(lat, long)
						.then(report => {
							setWeatherReport(report)
						})
				}
			})
	}

	useEffect(filterCountries, [countryFilter])

	const showCountry = (event) => {
		setCountryFilter(event.target.value)
	}

	return (
		<>
			<form>
				<label>find countries </label>
				<input value={countryFilter} onChange={onChangeCountryFilter}></input>
			</form>
			<Result countries={filteredCountries} showCountry={showCountry} weatherReport={weatherReport}/>
		</>
	)
}

export default App
