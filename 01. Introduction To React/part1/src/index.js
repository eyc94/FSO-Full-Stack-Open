import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

// Part 1C.
// import ReactDOM from 'react-dom';
// import App from './App';

// ReactDOM.render(
//     <App />,
//     document.getElementById('root')
// );

// Old way of incrementing counter.
// let counter = 1;

// const refresh = () => {
//     ReactDOM.render(
//         <App counter={counter} />,
//         document.getElementById('root')
//     );
// };

// setInterval(() => {
//     refresh();
//     counter += 1;
// }, 1000);
