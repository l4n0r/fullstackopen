const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => (
	<div>
		{props.parts.map(part => <Part key={part.id} part={part} />)}
	</div>
)

const Part = (props) => (
	<p>
		{props.part.name} {props.part.exercises}
	</p>
)

const Total = (props) => {
	const totalExercises = props.parts.reduce((tot, val) => tot + val.exercises, 0);
	return <b>total of {totalExercises} exercises</b>;
}

const Course = (props) => (
	<div>
		<Header course={props.course.name} />
		<Content parts={props.course.parts} />
		<Total parts={props.course.parts} />
	</div>
)

export default Course;