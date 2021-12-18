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

const Total = ({ course }) => {
    return (
        <div>
            Total of {course.parts.map(part =>
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

export default Course;