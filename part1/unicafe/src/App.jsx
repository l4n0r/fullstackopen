import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>;

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>;

const StatisticLine = ({ text, value }) => {
	return (
		<tr>
			<td>{text}</td>
			<td>{value}</td>
		</tr>
	);
}

const Statistics = ({ stats }) => {
	const [good, neutral, bad] = stats;
	const all = good + neutral + bad;
	const average = all === 0 ? 0 : (good - bad) / all;
	const positive = all === 0 ? 0 : (good / all) * 100;

	return (
		<table>
			<tbody>
				<StatisticLine text="good" value={good} />
				<StatisticLine text="neutral" value={neutral} />
				<StatisticLine text="bad" value={bad} />
				<StatisticLine text="all" value={all} />
				<StatisticLine text="average" value={average} />
				<StatisticLine text="positive" value={positive} />
			</tbody>
		</table>
	);
};


const App = () => {
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	const onClickGood = () => setGood(good + 1);
	const onClickNeutral = () => setNeutral(neutral + 1);
	const onClickBad = () => setBad(bad + 1);

	return (
		<div>
			<Header text="give feedback" />
			<Button text="good" onClick={onClickGood} />
			<Button text="neutral" onClick={onClickNeutral} />
			<Button text="bad" onClick={onClickBad} />

			<Header text="statistics" />
			<Statistics stats={[good, neutral, bad]} />
		</div>
	)
}

export default App