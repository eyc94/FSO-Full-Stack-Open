import React from 'react';

const Header = (props) => {
    return (
        <>
            <h1>{props.course.name}</h1>
        </>
    )
};

const Content = (props) => {
    return (
        <>
            {props.course.parts.map(part =>
                <Part key={part.id} part={part.name} exercise={part.exercises} />
            )}
        </>
    )
};

const Part = (props) => {
    return (
        <p>
            {props.part} {props.exercise}
        </p>
    )
};

const Total = (props) => {
    return (
        <div>
            Total of {props.course.parts.map(part =>
                part.exercises
            ).reduce((prev, curr) =>
                prev + curr, 0
            )} exercises
        </div>
    )
};

const Course = (props) => {
    return (
        <div>
            <Header course={props.course} />
            <Content course={props.course} />
            <Total course={props.course} />
        </div>
    )
};

const App = () => {
    const course = {
        id: 1,
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10,
                id: 1
            },
            {
                name: 'Using props to pass data',
                exercises: 7,
                id: 2
            },
            {
                name: 'State of a component',
                exercises: 14,
                id: 3
            },
            {
                name: 'Redux',
                exercises: 11,
                id: 4
            }
        ]
    };

    return <Course course={course} />
}

export default App;
